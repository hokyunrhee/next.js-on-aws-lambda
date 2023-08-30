"use client"

type PropsWithChildren<P = unknown> = P & { children: React.ReactNode }

type Provider = (props: PropsWithChildren) => JSX.Element

interface MultiProviderProps {
  children: React.ReactNode
  providers: Provider[]
}

export const MultiProvider = ({ providers, children }: MultiProviderProps) => {
  return providers.reduceRight((children, Provider) => <Provider>{children}</Provider>, children)
}
