import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from "zod"
import axios from "axios"

export function Form() {
    const createViagemSchema = z.object({
        nome: z.string().nonempty('O nome é obrigatório'),
        dataSaida: z.date({
            required_error: 'A Data de Saída é obrigatória',
        }),
        dataChegada: z.date({
            required_error: 'A Data de Chegada é obrigatória',
        }),
        valor: z.number({
            required_error: 'O campo valor é obrigatório',
        }).positive('O valor deve ser maior que zero'),
        destino: z.string().nonempty('O destino é obrigatório'),
    })

    type CreateViagemFormData = z.infer<typeof createViagemSchema>

    const [output, setOutput] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<CreateViagemFormData>({
        resolver: zodResolver(createViagemSchema)
    })

    async function createViagem(data: any) {
        const baseURL = "http://localhost:3000";

        const api = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        try {
            await api.post('/viagem', JSON.stringify(data, null, 2));
            setOutput(JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Erro ao criar viagem:', error);
            setOutput('Erro ao criar viagem. Verifique o console para mais informações.');
        }
    }

    console.log(errors)

    return (
        <main className="h-screen bg-zinc-950 gap-10 text-zinc-300 flex flex-col items-center justify-center">
            <h1 className='text-4xl font-semibold'>Formulário de Cadastro</h1>
            <form onSubmit={handleSubmit(createViagem)} className="flex flex-col w-full max-w-sm gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="">Nome</label>
                    <input type="text"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800 h-9"
                        {...register('nome')}
                    />
                    {errors.nome && <span className="text-red-400 text-sm">{errors.nome.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="">Data de Saída</label>
                    <input type="date"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800 h-9"
                        {...register('dataSaida', { valueAsDate: true })}
                    />
                    {errors.dataSaida && <span className="text-red-400 text-sm">{errors.dataSaida.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="">Data de Chegada</label>
                    <input type="date"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800 h-9"
                        {...register('dataChegada', { valueAsDate: true })}
                    />
                    {errors.dataChegada && <span className="text-red-400 text-sm">{errors.dataChegada.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="">Valor</label>
                    <input type="number" step="0.01"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800 h-9"
                        {...register('valor')}
                    />
                    {errors.valor && <span className="text-red-400 text-sm">{errors.valor.message}</span>}
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="">Destino</label>
                    <input type="text"
                        className="bg-zinc-900 px-3 shadow-sm rounded border-zinc-800 h-9"
                        {...register('destino')}
                    />
                    {errors.destino && <span className="text-red-400 text-sm">{errors.destino.message}</span>}
                </div>

                <button className="bg-emerald-500 rounded font-semibold h-10 hover:bg-emerald-600" type="submit">Salvar</button>
            </form>
            <pre>{output}</pre>
        </main>
    )
}
