
export default function StatusComponent(props) {

    if(props.status === 0){
        return (
           <div className="bg-yellow-100 w-24 text-center rounded-lg">
             <span className="text-yellow-500 ">
                Pending
            </span>
           </div>
        )
    }
    if(props.status === 1){
        return (
           <div className="bg-green-100 w-24 text-center rounded-lg">
             <span className="text-green-500 ">
                Approved
            </span>
           </div>
        )
    }
    if(props.status === 2){
        return (
           <div className="bg-red-100 w-24 text-center rounded-lg">
             <span className="text-red-500 ">
                Rejected
            </span>
           </div>
        )
    }
}