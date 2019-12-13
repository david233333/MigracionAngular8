describe('plan-manejo test', () => {
    let test;

    beforeEach(() => {
        test = {}
    })

    it('debería ser verdadero si es verdadero', () => {

        test.a = false;

        test.a = true;

        // assert
        expect(test.a).toBe(true);

    })

})