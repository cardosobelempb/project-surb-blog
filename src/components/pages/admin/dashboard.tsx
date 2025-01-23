'use client'

import { AdminHero } from '@/components/admin-hero'
import { DashboardDataService } from '@/server/dashboard/dashboard-data.service'
import { useBlogAdminStore } from '@/stores/blog-admin.store'
import { DashboardData } from '@/types/Dashboard'
import { Card, Col, Row, Statistic } from 'antd'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

export const DashboardPage = () => {
    const { blogSelected } = useBlogAdminStore()
    const { data } = useSession()
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboarData] = useState<DashboardData>()

    const DASHBOARD_TRANSALATIONS = useTranslations('DashboardPage')

    useEffect(() => {
        const handleLoadin = async () => {
            if (!blogSelected) return
            setLoading(true)

            const data = await DashboardDataService({ blogId: blogSelected.id })
            setDashboarData(data)
            setLoading(false)
        }
        handleLoadin()
    }, [blogSelected])

    return (
        <div>
            <div className="space-y-6 pb-5">
                <AdminHero
                    title={DASHBOARD_TRANSALATIONS('title', {
                        name: data?.user.name,
                    })}
                    description={DASHBOARD_TRANSALATIONS('descriptio', {
                        blogName: blogSelected?.title,
                    })}
                />
                <div className="px-8">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={DASHBOARD_TRANSALATIONS(
                                        'total_users',
                                    )}
                                    value={dashboardData?.totalUsers}
                                    valueStyle={{ color: '#489703' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={DASHBOARD_TRANSALATIONS(
                                        'total_blogs',
                                    )}
                                    value={dashboardData?.totalPosts}
                                    valueStyle={{ color: '#FFB108' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card>
                                <Statistic
                                    title={DASHBOARD_TRANSALATIONS(
                                        'your_total_posts',
                                    )}
                                    value={dashboardData?.totalPostsMadeByYou}
                                    valueStyle={{ color: '#0572FF' }}
                                    loading={loading}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
