interface SkeletonChartProps {
    heightClass: string;

}

const SkeletonChart = ({ heightClass }: SkeletonChartProps) => (
    <div className={`${heightClass}  bg-gray-200 animate-pulse rounded-xl`}></div>

);

export default SkeletonChart;