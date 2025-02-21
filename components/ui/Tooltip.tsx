interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip = ({ text, children }: TooltipProps) => (
  <div className="group relative inline-block">
    {children}
    <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded px-2 py-1 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap">
      {text}
    </span>
  </div>
)

export default Tooltip
