import CircleChart from '@/components/circle-chart';
import ManageInstruments from '@/components/retirement/manage-instrument';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Instrument, Retirement } from '@/types';
import { Head } from '@inertiajs/react';
import { Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Retirement',
        href: '/retirement',
    },
];

interface RetirementProps {
    retirement: Retirement | null;
    instruments: Instrument[];
    fundsLeftToInvest: number;
    birthdate: string | Date;
}

export default function RetirementPage({ retirement, fundsLeftToInvest, instruments, birthdate }: RetirementProps) {
    birthdate = new Date(birthdate);
    const totalWeight = instruments.reduce((acc, instrument) => acc + instrument.weight, 0);
    const freeCashWeight = 100 - totalWeight;
    const chartData = [
        {
            name: 'Free Cash',
            amount: (freeCashWeight / 100) * fundsLeftToInvest,
        },
        ...instruments.map((instrument) => ({
            name: instrument.name,
            amount: (instrument.weight / 100) * fundsLeftToInvest,
        })),
    ].sort((a, b) => b.amount - a.amount);

    const totalROI =
        instruments.reduce((acc, instrument) => {
            const roi = instrument.weight * instrument.yearly_return;
            return acc + roi;
        }, 0) / 100;

    const currentAge = new Date().getFullYear() - birthdate.getFullYear();
    const yearsToRetirement = 65 - currentAge;

    const forecastData = Array.from({ length: yearsToRetirement }, (_, index) => {
        const totalAmount = instruments.reduce((sum, instrument) => {
            const monthlyContribution = (instrument.weight / 100) * fundsLeftToInvest;
            const yearlyReturnRate = instrument.yearly_return / 100;

            const yearsPassed = index + 1;
            const futureValue = monthlyContribution * 12 * ((Math.pow(1 + yearlyReturnRate, yearsPassed) - 1) / yearlyReturnRate);

            return sum + futureValue;
        }, 0);

        return {
            year: new Date().getFullYear() + index,
            amount: Number(totalAmount.toFixed(0)),
        };
    });

    // ACCOUNTING INTEREST MONTHLY
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // const forecastData = Array.from({ length: yearsToRetirement }, (_, index) => {
    //     const totalAmount = instruments.reduce((sum, instrument) => {
    //         const monthlyContribution = (instrument.weight / 100) * fundsLeftToInvest; // monthly contribution for this instrument
    //         const monthlyReturnRate = instrument.yearly_return / 100 / 12; // Convert yearly return to monthly return rate

    //         // Calculate the future value of monthly contributions for this instrument over the months
    //         const monthsPassed = (index + 1) * 12; // Total months for each year
    //         const futureValue = monthlyContribution * ((Math.pow(1 + monthlyReturnRate, monthsPassed) - 1) / monthlyReturnRate);

    //         return sum + futureValue;
    //     }, 0);

    //     return {
    //         year: new Date().getFullYear() + index,
    //         amount: Number(totalAmount.toFixed(0)), // round the total amount to the nearest integer
    //     };
    // });
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // //

    const formatNumber = (number: number) => {
        return number.toLocaleString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Retirement" />
            {retirement ? (
                <div className="mt-4 md:px-8">
                    <h1 className="mb-2 text-3xl font-bold">Retirement Plan</h1>
                    <h1>Welcome to your Retirement!</h1>
                    <div className="mt-8 flex">
                        <div>
                            <CircleChart title="Retirement" data={chartData} />
                            <h2>ROI: {totalROI.toFixed(2)}%</h2>
                            <h2>Years to Retirement: {yearsToRetirement}</h2>
                        </div>

                        <LineChart width={600} height={450} data={forecastData} className="mt-6">
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="year" interval={Math.ceil(yearsToRetirement / 15)} />
                            <YAxis width={120} tickFormatter={formatNumber} />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="border bg-white p-2">
                                                <p className="text-black">{`Year: ${label}`}</p>
                                                <p className="text-black">{`Amount: ${formatNumber(payload[0].value as number)}`}</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </LineChart>
                    </div>
                    <ManageInstruments instruments={instruments} />
                </div>
            ) : (
                <div className="md:px-4">
                    <h1>You don't have a Retirement</h1>
                    <p>You need to create or join a Retirement.</p>
                </div>
            )}
        </AppLayout>
    );
}
