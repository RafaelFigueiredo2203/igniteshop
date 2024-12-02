import Link from 'next/link'

export default function Page404() {
  return (
    <div className="flex-1 flex flex-col items-center justify-around ">
      <span>Erro 404!</span>
      <span>Página não encontrada!</span>
      <Link
        href="/"
        className="h-16 bg-[#00875F] flex items-center justify-center bottom-0 hover:opacity-40 px-4 rounded-2xl"
      >
        <strong>Voltar ao Catálogo</strong>
      </Link>
    </div>
  )
}
