import { HomePage } from '@/components/pages/Home'
import { BlogFindAllService } from '@/server/blog/blog-find-all.service'

const Home = async () => {
    const { data: blogs } = await BlogFindAllService()

    return <HomePage blogs={blogs} />
}

export default Home
