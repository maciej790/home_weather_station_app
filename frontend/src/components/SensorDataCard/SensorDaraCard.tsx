export type SensorDataCardProps = {
    data: string;
}

const SensorDataCard = ({ data }: SensorDataCardProps) => {
    return <div className="h-40 bg-indigo-200 rounded-xl p-20 shadow-lg flex items-center justify-center font-bold text-indigo-800">{data}</div>
}

export default SensorDataCard;