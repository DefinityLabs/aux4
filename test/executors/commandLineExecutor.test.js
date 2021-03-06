const childProcess = require('child_process');

const commandLineExecutor = require('../../lib/executors/commandLineExecutor');

const out = require('../../lib/output');
const interpreter = require('../../lib/interpreter');
const parameterInterpreter = require('../../lib/interpreters/parameterInterpreter');

describe('commandLineExecutor', () => {
  let spyOnInterpreter;

  beforeEach(() => {
    interpreter.add(parameterInterpreter);
  	spyOnInterpreter = jest.spyOn(interpreter, 'interpret');
  });

  describe('execute', () => {
    let command, action, args, result;

    describe('with error', () => {
      beforeEach(() => {
      	out.println = jest.fn();
        childProcess.execSync = jest.fn().mockImplementation(() => {
          let err = new Error('test');
          throw err;
        });

        action = 'mkdir $folder';
        args = [];
        parameters = {folder: 'test'};
      });

      it('throws error', () => {
        expect(() => {
          commandLineExecutor.execute({}, action, args, parameters)
        }).toThrow();
      });
    });

    describe('without error', () => {
      beforeEach(() => {
        out.println = jest.fn();
      	childProcess.execSync = jest.fn().mockReturnValue({
          toString: jest.fn().mockReturnValue('output message')
        });

        action = 'mkdir $folder';
        args = [];
        parameters = {folder: 'test'};

        result = commandLineExecutor.execute({}, action, args, parameters);
      });

      it('should call interpret', () => {
        expect(interpreter.interpret).toHaveBeenCalledWith({}, action, args, parameters);
      });

      it('calls childProcess.exec', () => {
        expect(childProcess.execSync).toHaveBeenCalledWith('mkdir test');
      });

      it('prints output message', () => {
        expect(out.println.mock.calls.length).toEqual(1);
        expect(out.println).toHaveBeenCalledWith('output message');
      });

      it('should add output in parameters as response', () => {
        expect(parameters.response).toEqual('output message');
      });

      it('returns true', () => {
        expect(result).toBeTruthy();
      });
    });

    describe('when command prefix is json:', () => {
      describe('with error', () => {
        beforeEach(() => {
          out.println = jest.fn();
        	childProcess.execSync = jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('{invalid json}')
          });

          action = 'json:cat person.json';
          args = [];
          parameters = {};
        });

        it('throws error', () => {
          expect(() => {
            commandLineExecutor.execute({}, action, args, parameters)
          }).toThrow();
        });
      });

      describe('without error', () => {
        beforeEach(() => {
          out.println = jest.fn();
        	childProcess.execSync = jest.fn().mockReturnValue({
            toString: jest.fn().mockReturnValue('{"name": "John"}')
          });

          action = 'json:cat person.json';
          args = [];
          parameters = {};

          result = commandLineExecutor.execute({}, action, args, parameters);
        });

        it('prints output message', () => {
          expect(out.println.mock.calls.length).toEqual(1);
          expect(out.println).toHaveBeenCalledWith('{"name": "John"}');
        });

        it('should add object person in parameters as response', () => {
          expect(parameters.response.name).toEqual('John');
        });

        it('returns true', () => {
          expect(result).toBeTruthy();
        });
      });
    });
  });
});
