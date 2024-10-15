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
import { Badge } from 'react-bootstrap';


export const INVOICECOLUMNS = [

    {
        Header: 'Sl no',
        Footer: 'Id',
        accessor: (row, index) => index + 1,
        Filter: ColumnFilter,
        disableFilters: true,
        width:"auto"
    },

    {
        Header: 'Invoice No',
        accessor:'invoiceNo',
        Filter: ColumnFilter,
        disableFilters: true,
        
    },

    {
        Header: 'Invoice Date',
        accessor: 'invoiceDate',
        Filter: ColumnFilter,
        disableFilters: true,
        
    },
    {
        Header: 'Invoice Due Date',
        accessor: 'DueDate',
        Filter: ColumnFilter,
        disableFilters: true,
    },

    {
        Header: 'Sub Total',
        accessor: 'subTotal',
        Filter: ColumnFilter,
        disableFilters: true,
    },

    {
        Header: 'Total Tax',
        accessor: 'totalTax',
        Filter: ColumnFilter,
        disableFilters: true,
    },
    {
        Header: 'Total Amount',
        accessor: 'total',
        Filter: ColumnFilter,
        disableFilters: true,
    },
    {
        Header: 'Status',
        // accessor:( data)=>data.isPaid?"PAID":"NOT PAID",
        accessor:( data)=>data.isPaid?<Badge bg="success">PAID</Badge>:<Badge bg="danger">NOT PAID</Badge>,
        Filter: ColumnFilter,
        disableFilters: true,
    }

  



]
