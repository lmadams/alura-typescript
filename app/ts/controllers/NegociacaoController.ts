import { NegociacoesView, MensagemView } from '../views/index';
import { logarTempoDeExecucao, domInject, throttle } from '../helpers/decorators/index'
import { Negociacoes, Negociacao, NegociacaoParcial } from '../models/index';
import { NegociacaoService, HandlerFunction } from '../services/index'
import { imprime } from '../helpers/index'

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes: Negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView', true);
    private _mensagemView = new MensagemView('#mensagemView');

    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @logarTempoDeExecucao(true)
    @throttle()
    adiciona() {

        let data = new Date(this._inputData.val().replace(/-/g, ','));
        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente negociacoes em dias uteis!!!!')
            return;
        }
        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        negociacao.paraTexto();

        this._negociacoes.adiciona(negociacao);

        imprime(negociacao, this._negociacoes);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    private _ehDiaUtil(data: Date): boolean {
        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }

    @throttle()
    async importaDados() {

        try {
            const isOk: HandlerFunction = (res: Response) => {
                if (res.ok) {
                    return res;
                } else {
                    throw new Error(res.statusText);
                }
            }
            const negociacoesParaImportar = await this._service.obterNegociacoes((isOk));

            const negociacaoJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter(negociacao =>
                    !negociacaoJaImportadas.some(jaImportada =>
                        negociacao.ehIgual(jaImportada)))
                .forEach(negociacao => this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);
        } catch (err) {
            this._mensagemView.update(err.message);
        }
    };
}

}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}