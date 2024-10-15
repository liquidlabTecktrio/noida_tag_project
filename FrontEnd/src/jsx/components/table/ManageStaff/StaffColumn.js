import { format } from 'date-fns';
import axios from "axios";
import { ColumnFilter } from '../ColumnFilter';
import 'font-awesome/css/font-awesome.min.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { store } from '../../../../store/store';
import config from '../../../../services/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'



export const STAFFCOLUMNS = [

    {
        Header: 'Sl no',
        Footer: 'Id',
        accessor: (row, index) => index + 1,
        Filter: ColumnFilter,
        disableFilters: true,
        width:"auto"
    },

    {
        Header: 'Name',
        Footer: 'Name',
        accessor:(data)=> data.employeeFirstName +' '+data.employeeLastName,
        Filter: ColumnFilter,
        disableFilters: true,
        
    },

    {
        Header: 'DOB',
        Footer: 'DOB',
        accessor: 'DOB',
        
        Filter: ColumnFilter,
        disableFilters: true,
        
    },
    {
        Header: 'Gender',
        Footer: 'Gender',
        accessor: 'gender',
        Filter: ColumnFilter,
        disableFilters: true,
    },

    {
        Header: 'DOJ',
        Footer: 'DOJ',
        accessor: 'dateOfJoin',
        Filter: ColumnFilter,
        disableFilters: true,
    },

    {
        Header: 'PhoneNumber',
        Footer: 'PhoneNumber',
        accessor: 'phoneNumber',
        Filter: ColumnFilter,
        disableFilters: true,
    },
    {
        Header: 'Email',
        Footer: 'Email',
        accessor: 'Email',
        Filter: ColumnFilter,
        disableFilters: true,
    },
    {
        Header: 'Designation',
        Footer: 'Designation',
        accessor: 'designation'??'',
        Filter: ColumnFilter,
        disableFilters: true,
    },
    {
        Header: 'Address',
        Footer: 'Address',
        accessor: (data)=>data.employeeAddress!=null?data.employeeAddress:"",
        Filter: ColumnFilter,
        disableFilters: true,
    },

    {
        Header: 'Profile',
        Footer: 'Profile',
        accessor: 'employeePicUrl'??'',
        Cell: (data) =>data.employeePicUrl!=null?<img src={data.row.original.bannerImage} width={64} height={70} />:'',
        Filter: ColumnFilter,
        disableFilters: true,
    },


     {
        Header: 'Charges',
        Footer: 'Charges',
        accessor: 'chargesFromClient'??'',
        Filter: ColumnFilter,
        disableFilters: true,
    },



]
