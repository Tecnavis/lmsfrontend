import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import { BASE_URL } from '../Helper/handle-api';

const MonthlyRevenue = () => {
    const [incomeData, setIncomeData] = useState<number[]>([]);
    const [expenseData, setExpenseData] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [loading1, setLoading1] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch income data
                const incomeResponse = await axios.get(`${BASE_URL}/transaction/monthly-income`); // Adjust API route as needed
                const income = incomeResponse.data;
                const monthlyIncome = Array(12).fill(0);
                income.forEach((item: { _id: number, totalPayAmount: number }) => {
                    monthlyIncome[item._id - 1] = item.totalPayAmount;
                });
                setIncomeData(monthlyIncome);
                setLoading1(false);

                // Fetch expense data
                const expenseResponse = await axios.get(`${BASE_URL}/expence/summary/monthly`); // Adjust API route as needed
                const expenses = expenseResponse.data.monthlyExpenses;
                setExpenseData(expenses);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
                setLoading1(false);
            }
        };

        fetchData();
    }, []);

    // Revenue and Expenses Chart
    const revenueAndExpensesChart: any = {
        series: [
            {
                name: 'Income',
                data: incomeData,
            },
            {
                name: 'Expenses',
                data: expenseData,
            },
        ],
        options: {
            chart: {
                height: 325,
                type: 'area',
                zoom: { enabled: false },
                toolbar: { show: false },
            },
            dataLabels: { enabled: false },
            stroke: { show: true, curve: 'smooth', width: 2 },
            colors: ['#1B55E2', '#FF5733'],
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            xaxis: {
                labels: { style: { fontSize: '12px' } },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '12px',
                    },
                },
            },
            grid: { strokeDashArray: 5 },
            tooltip: { x: { show: false } },
            fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.28, opacityTo: 0.05 } },
        },
    };

    return (
        <div>
            <div className="">
                <div className="panel h-full xl:col-span-2">
                    <div className="flex items-center justify-between dark:text-white-light mb-5">
                        <h5 className="font-semibold text-lg">Monthly Revenue and Expenses</h5>
                    </div>
                    <div className="relative">
                        <div className="bg-white dark:bg-black rounded-lg overflow-hidden">
                            {loading || loading1 ? (
                                <div className="min-h-[325px] grid place-content-center bg-white-light/30 dark:bg-dark dark:bg-opacity-[0.08] ">
                                    <span className="animate-spin border-2 border-black dark:border-white !border-l-transparent  rounded-full w-5 h-5 inline-flex"></span>
                                </div>
                            ) : (
                                <ReactApexChart series={revenueAndExpensesChart.series} options={revenueAndExpensesChart.options} type="area" height={325} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MonthlyRevenue;
