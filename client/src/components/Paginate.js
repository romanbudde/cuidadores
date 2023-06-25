import React from 'react';
 
const Paginate = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];

    const lastPage = Math.ceil(totalPosts / postsPerPage);
    
    console.log('------ current page: ', currentPage);
    console.log('------ amount of pages calculation: ', Math.ceil(totalPosts / postsPerPage));
    
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if(i <= 0){

        }
        else if(i > lastPage) {

        }
        else {
            pageNumbers.push(i);
        }
    }
 
   console.log('-------pageNumbers[0]: ', pageNumbers[0]);
   console.log('-------pageNumbers[al final]: ', pageNumbers[pageNumbers.length - 1]);

    if(pageNumbers[0] === currentPage) {
        pageNumbers.push(3);
        // console.log()
    }

    if(lastPage === currentPage) {
        pageNumbers.unshift(lastPage - 2);
        console.log('AT LAST PAGEEEEEEEEEEEEEEEEEE')
    }

    return (
        <div className="pagination-container">
            <ul className="pagination flex flex-row justify-evenly">
                {pageNumbers.map((number) => (
                <li
                    key={number}
                    onClick={() => paginate(number)}
                    className={`page-number px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-200' : ''}`}
                >
                    {number}
                </li>
                ))}
                {/* <p className='mt-auto'>...</p>
                <li
                    key={lastPage}
                    onClick={() => paginate(lastPage)}
                    className={`page-number px-3 py-1 rounded-md ${lastPage === currentPage ? 'bg-blue-200' : ''}`}
                >
                    6
                </li> */}
            </ul>
        </div>
    );
};
 
export default Paginate;