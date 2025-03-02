import AdvisorChat from '@/components/advisor/advisor-chat';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Advisor',
        href: '/advisor',
    },
];
const Advisor = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Household" />
            <div className="mt-4 md:px-8">
                <h1 className="mb-2 text-3xl font-bold">Your personal advisor</h1>
                <h1>Ask them anything!</h1>

                <AdvisorChat />
            </div>
        </AppLayout>
    );
};

export default Advisor;
