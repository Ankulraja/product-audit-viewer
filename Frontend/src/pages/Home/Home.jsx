import { Greeting, SheetSelector } from '../../components'
import { MainLayout } from '../../layouts'

const Home = () => {
  return (
    <MainLayout>
      <Greeting />
      <SheetSelector />
    </MainLayout>
  )
}

export default Home
