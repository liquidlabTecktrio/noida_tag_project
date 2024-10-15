// import React,{ useMemo } from 'react';
// import PageTitle from "../../../layouts/PageTitle";
import { useTable, useGlobalFilter, useFilters, usePagination } from 'react-table';
import { STAFFCOLUMNS } from './StaffColumn';
import { GlobalFilter } from '../GlobalFilter';
import { useEffect, useState } from 'react';
// import axios from 'axios';
// import contactUsActions from '../../../../store/actions/ContactActions'
import { useDispatch, useSelector } from "react-redux";
// import './table.css';
import "../filtering.css";
// import './filtering.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../../../services/config';
import axios from 'axios';
import { style } from 'glamor';









export const FilteringTable = () => {
	// var contactData=[];
	const [value, setData] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		specificClientEmployeeAPI()


	}, []);


	const [StaffsTableData, setStaffsTableData] = useState([])
	const clientID = sessionStorage.getItem('id')
	// console.log('clientID: ', clientID);



	function specificClientEmployeeAPI() {
		axios({
			url: config.baseUrl + "specificClientEmployee",
			// url: config.baseUrl + "specificClientEmployee/" + clientID,
			method: "POST",
			headers: {
				'token': sessionStorage.getItem('token'),
			},
            data: {
				'clientId':clientID
			},

		}).then((res) => {
			if (res.status == 200) {
				getAllStaffsToast()
				setStaffsTableData(res.data.data)
				console.log('res.data.data: ', res.data.data);

			}
			else if (res.status == 201) { console.log(res.data.message) }
			else if (res.status == 401) {
				alert("you are unauthorized.. please login to continue");
				window.location = '/page-login'
			}
		}).catch((err) => {
			console.log('err: ', err);
			// if (err.response.data.status == 401) {
			// 	alert("you are unauthorized.. please login to continue");
			// 	window.location = '/page-login'
			// 	sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
			// 	sessionStorage.removeItem('ClientImgUrl');
			// }
		}
		);
	}




	// toast functions
	const getAllStaffsToast = () => toast.success("All staffs fetched successfully");







	// const data =  StaffsTableData.contactUsList.data.data;
	const data = StaffsTableData
	const columns = STAFFCOLUMNS;
	const tableInstance = useTable({
		columns,
		data,
		initialState: { pageIndex: 0 }
	}, useGlobalFilter, usePagination)




	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		prepareRow,
		state,
		page,
		gotoPage,
		pageCount,
		pageOptions,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		setGlobalFilter,
	} = tableInstance


	const { globalFilter, pageIndex } = state


	return (
		<>
			{/* <PageTitle activeMenu="Filtering" motherMenu="Table" /> */}
			<div className="card">
				<ToastContainer />
				<div className="card-header" style={{ backgroundColor: '#F8857D' }}>
					<h4 className="card-title">Staffs</h4>
				</div>
				<div className="card-body">
					<div className="table-responsive">
						<GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
						<table {...getTableProps()} className="table dataTable display">
							<thead>
								{headerGroups.map(headerGroup => (
									<tr {...headerGroup.getHeaderGroupProps()}>
										{headerGroup.headers.map(column => (
											<th {...column.getHeaderProps(
												{
													style: {
														// width:"auto"
														minWidth: "150px"
													}
												}
											)}>
												{column.render('Header')}
												{column.canFilter ? column.render('Filter') : null}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody {...getTableBodyProps()} className="" >

								{page.map((row) => {
									prepareRow(row)

									return (
										<tr {...row.getRowProps(

										)}>
											{row.cells.map((cell) => {
												return <td {...cell.getCellProps()}> {cell.render('Cell')} </td>
											})}
										</tr>
									)
								})}
							</tbody>
						</table>
						<div className="d-flex justify-content-between">
							<span>
								Page{' '}
								<strong>
									{pageIndex + 1} of {pageOptions.length}
								</strong>{''}
							</span>
							<span className="table-index">
								Go to page : {' '}
								<input type="number"
									className="ml-2"
									defaultValue={pageIndex + 1}
									onChange={e => {
										const pageNumber = e.target.value ? Number(e.target.value) - 1 : 0
										gotoPage(pageNumber)
									}}
								/>
							</span>
						</div>
						<div className="text-center mb-3">
							<div className="filter-pagination  mt-3">
								<button className=" previous-button" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{'<<'}</button>

								<button className="previous-button" onClick={() => previousPage()} disabled={!canPreviousPage}>
									Previous
								</button>
								<button className="next-button" onClick={() => nextPage()} disabled={!canNextPage}>
									Next
								</button>
								<button className=" next-button" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>{'>>'}</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)

}
export default FilteringTable;