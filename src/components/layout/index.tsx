import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd"
import Header from "./Header"
import { PieChartOutlined } from "@ant-design/icons"

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
    Header={Header}
    Title={(titleProps) => <ThemedTitleV2 {...titleProps} text="Berry Agency" icon= {<PieChartOutlined  />} />}
    >
        {children}
    </ThemedLayoutV2>
  )
}

export default Layout