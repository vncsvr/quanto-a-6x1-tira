import { Calculadora } from "@/components/calculadora";

const link = "underline";

export default function Home() {
  return (
    <>
      <main className="mx-auto min-h-dvh max-w-[440px]">
        <Calculadora />
        <section className="px-6 pb-8 text-[12.5px] leading-normal text-mute *:mt-[22px]">
          <p><b>Como calculamos.</b> Na 6x1 você tem 1 folga por semana; na 5x2, 2. São 52 dias livres a menos por ano, vezes os anos que faltam até a aposentadoria, supondo que você siga na 6x1 até lá. Todo cartão sai desse mesmo número, com uma regra simples: praia ou descanso e almoço de família = 1 por folga perdida; amigos = 1 a cada 2 folgas; pelada = 1 a cada 4; estudo = 4 horas por folga; horas acordado = 16 por folga; fins de semana = folgas ÷ 2; semanas = folgas ÷ 7; verões = folgas ÷ 89 (o verão vai de 21/12 a 20/03); anos e infância = folgas ÷ 365. Aniversários: supomos 10 festas por ano de pessoas próximas; na 6x1, cada uma tem 1 chance em 7 a mais de cair no seu dia de trabalho. São conversões ilustrativas, não pesquisa.</p>
          <p><b>Fontes.</b> <a className={link} href="https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm" target="_blank" rel="noopener">Constituição, art. 7º, XIII e XV</a> (até 44 horas semanais; repouso semanal remunerado, de preferência aos domingos) · <a className={link} href="https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm" target="_blank" rel="noopener">CLT, art. 67</a> (24 horas seguidas de descanso por semana) · <a className={link} href="https://www.planalto.gov.br/ccivil_03/constituicao/emendas/emc/emc103.htm" target="_blank" rel="noopener">EC 103/2019</a> (idade mínima de aposentadoria) · PEC 221/2019: reduz a jornada de 44 para 40 horas e garante 2 folgas por semana. Aprovada na Câmara e na CCJ do Senado; em discussão no plenário do Senado desde 06/10/2026 (<a className={link} href="https://www12.senado.leg.br/noticias/videos/2026/10/fim-da-escala-6x1-davi-explica-proximos-passos-da-pec-no-senado" target="_blank" rel="noopener">Agência Senado</a>).</p>
        </section>
      </main>
      <footer className="px-6 pb-8 text-center text-xs text-mute">Calculadora feita por um eleitor voluntário, sem fins comerciais. Sem cookies, sem cadastro, sem coleta de dados.</footer>
    </>
  );
}
