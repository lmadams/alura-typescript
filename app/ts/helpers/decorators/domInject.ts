export function domInject(seletor: string) {

    return function(target: any, key: string) {

        let elemento: JQuery;

        const getter = function() {
            if(!elemento) {
                console.log(`Buscando o elemento do DOM pelo seletor ${seletor}`);
                elemento = $(seletor);
            }

            return elemento;
        }

        Object.defineProperty(target, key, {
            get: getter    
        });

    }
}