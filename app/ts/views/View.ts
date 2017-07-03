/**
 * Classe abstrata não pode ser instanciada... apenas herdada
 */

export abstract class View<T> {

    protected _elemento: JQuery;
    private _escapar: boolean;

    /**
     * 
     * @param selector 
     * @param escapar (?) Parametro opcional ou passar um valor default (false)
     */
    constructor(selector: string, escapar: boolean = false) {
        this._elemento = $(selector);
        this._escapar = escapar; //permitir ou nao script dentro de template
    }

    update(model: T): void {
        let template = this.template(model);
        if (this._escapar) {
            template = template.replace(/<script>[\s\S]*?<\/script>/g, '');
        }
        this._elemento.html(template);
    }

    // Obriga a implementar o metodo na classe que herda view 
    abstract template(model: T): string;
}
