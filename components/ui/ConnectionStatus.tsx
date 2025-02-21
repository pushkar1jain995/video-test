interface ConnectionStatusProps {
  isConnected: boolean;
}

const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => (
  <div className="fixed top-4 right-4 flex items-center space-x-2">
    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
    <span className="text-sm text-gray-600">
      {isConnected ? 'Connected' : 'Connecting...'}
    </span>
  </div>
)

export default ConnectionStatus
