const colors = require('colors');
const out = require('../lib/output');

const help = require('../lib/help');

describe('help', () => {
  describe('print', () => {
    let command;

    beforeEach(() => {
      out.println = jest.fn();

    	command = {
        value: 'cmd',
        help: {
          description: 'this is the help description.\nSecond line.'
        }
      };
    });

    describe('without help', () => {
      beforeEach(() => {
      	help.print({value: 'main'});
      });

      it('prints message without description', () => {
        expect(out.println).toHaveBeenCalledWith('main'.yellow, ' ', '');
      });
    });

    describe('without length', () => {
      beforeEach(() => {
      	help.print(command);
      });

      it('prints command help description', () => {
        expect(out.println).toHaveBeenCalledWith(command.value.yellow, ' ', 'this is the help description.\n      Second line.');
      });
    });

    describe('with length', () => {
      beforeEach(() => {
        help.print(command, 8);
      });

      it('prints command help description', () => {
        expect(out.println).toHaveBeenCalledWith(('     ' + command.value).yellow, ' ', 'this is the help description.\n           Second line.');
      });
    });

    describe('with variables', () => {
      beforeEach(() => {
      	command.help['variables'] = [
          {
            name: 'text',
            text: 'Text parameter to be displayed',
            default: 'echo'
          },
          {
            name: 'test',
            text: 'Test parameter to be displayed.\nSecond line.'
          },
          {
            name: 'name'
          }
        ];

        help.print(command, 3);
      });

      it('prints the text variable', () => {
        expect(out.println.mock.calls[1][0]).toEqual('        -');
        expect(out.println.mock.calls[1][1]).toEqual(command.help.variables[0].name.cyan);
        expect(out.println.mock.calls[1][2]).toEqual(`[${command.help.variables[0].default.italic}]`);
        expect(out.println.mock.calls[1][3]).toEqual(command.help.variables[0].text);
      });

      it('prints the test variable', () => {
        expect(out.println.mock.calls[2][0]).toEqual('        -');
        expect(out.println.mock.calls[2][1]).toEqual(command.help.variables[1].name.cyan);
        expect(out.println.mock.calls[2][2]).toEqual('');
        expect(out.println.mock.calls[2][3]).toEqual('Test parameter to be displayed.\n          Second line.');
      });

      it('prints the name variable', () => {
        expect(out.println.mock.calls[3][0]).toEqual('        -');
        expect(out.println.mock.calls[3][1]).toEqual(command.help.variables[2].name.cyan);
        expect(out.println.mock.calls[3][2]).toEqual('');
        expect(out.println.mock.calls[3][3]).toEqual('');
      });
    });
  });
});
