type ButtonProps = {
    text: string;
    onClick?: () => void;
};

export default function Button({ text, onClick }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
            {text}
        </button>
    );
}