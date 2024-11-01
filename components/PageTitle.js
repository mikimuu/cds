export default function PageTitle({ children }) {
  return (
    <h1 className="text-5xl font-extrabold leading-9 tracking-tight text-brblue dark:text-bryellow sm:text-4xl sm:leading-10 md:text-5xl md:leading-14">
      {children}
    </h1>
  )
}
