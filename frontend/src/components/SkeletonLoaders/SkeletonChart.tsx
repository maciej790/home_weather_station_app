interface SkeletonChartProps {
    heightClass: string;
    spanClass: string;
}

const SkeletonChart = ({ heightClass, spanClass }: SkeletonChartProps) => (
    <div className={`${heightClass} ${spanClass} bg-gray-200 rounded-xl animate-pulse shadow-lg`} />
);

export default SkeletonChart;