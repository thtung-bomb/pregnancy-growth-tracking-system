
interface TabProps {
    text: string
}
const Tab = ({ text }: TabProps) => {
    return (
        <div className='border border-solid py-2 px-5 rounded-lg'>
            {text}
        </div>
    )
}

export default Tab
