const AudioPlayer: React.FC<{ src: string }> = ({ src }) => {
    return (
        <audio controls className="w-full max-w-[400px] mx-auto">
            <source src={src} type="audio/mpeg" />
        </audio>
    )
};


export default AudioPlayer;