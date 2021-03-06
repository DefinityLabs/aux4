describe('crypto', () => {
  let crypto, text, encryptedText;

  describe('without env variable', () => {
    beforeEach(() => {
      jest.resetModules();
    	crypto = require('../lib/crypto');

      text = 'this is the pure text';
      encryptedText = crypto.encrypt(text);
    });

    describe('text is encrypted', () => {
      it('returns the text encrypted', () => {
        expect(encryptedText).not.toEqual(text);
      });
    });

    describe('decrypt', () => {
      it('returns the original text', () => {
        expect(crypto.decrypt(encryptedText)).toEqual(text);
      });
    });
  });

  describe('with env variable', () => {
    beforeEach(() => {
      jest.resetModules();
      process.env.AUX4_SECURITY_KEY = 'DF62446FD8C45959';
    	crypto = require('../lib/crypto');

      text = 'this is the pure text';
      encryptedText = crypto.encrypt(text);
    });

    describe('text is encrypted', () => {
      it('returns the text encrypted', () => {
      	expect(encryptedText).not.toEqual(text);
      });
    });

    describe('decrypt', () => {
      it('returns the original text', () => {
        expect(crypto.decrypt(encryptedText)).toEqual(text);
      });
    });
  });
});
