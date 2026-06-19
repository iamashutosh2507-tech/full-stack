interface StatusIndicatorProps {
status: string;
}

export default function StatusIndicator({
status,
}: StatusIndicatorProps) {
return <span>{status}</span>;
}
