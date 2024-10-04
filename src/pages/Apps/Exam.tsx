import { Link } from "react-router-dom";
import PayFeeform from "../Pages/PayFeeForm";
import IconPlus from "../../components/Icon/IconPlus";


const Exam = () => {
   
    return (
    <div>
        <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Exam
                    </Link>
                </li>
            </ul>
            <div className="panel flex-1 overflow-auto h-full">
            <div className="pb-5">
                        <button className="btn btn-primary w-full" type="button" >
                            <IconPlus className="w-5 h-5 ltr:mr-2 rtl:ml-2 shrink-0" />
                            Add Exam
                        </button>
                    </div>
            </div>
    </div>
    );
};

export default Exam;
