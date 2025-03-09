export default function PageTitle({ children }) {
  return (
    <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight xs:leading-9 tracking-tight text-brblue dark:text-bryellow sm:leading-10 md:leading-14">
      {children}
    </h1>
  )
}
