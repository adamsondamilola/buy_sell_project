import { ClipLoader } from 'react-spinners';

const Spinner = (props) => {
  return (
    <>
    {props.loading? 
      <div className="flex flex-col justify-center items-center">
      <ClipLoader color="#4A90E2" loading={props.loading} size={25} />
    </div>
    :
    ''
  }
    </>
  );
};

export default Spinner;

