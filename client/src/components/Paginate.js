import React, { Fragment } from 'react';
 
const Paginate = ({ postsPerPage, totalPosts, paginate, currentPage }) => {
    const pageNumbers = [];
    const amountOfPages = Math.ceil(totalPosts / postsPerPage);
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
   console.log('-------amount of pages: ', amountOfPages);

    // estamos en la primer pagina

    if(amountOfPages > 2) {
        if(pageNumbers[0] === currentPage) {
            pageNumbers.push(3);
            // console.log()
        }
    
        // estamos en la ultima pagina
        if(lastPage === currentPage) {
            pageNumbers.unshift(lastPage - 2);
            console.log('AT LAST PAGEEEEEEEEEEEEEEEEEE')
        }
    }

    return (
        <Fragment>
            { amountOfPages > 1 && (
                <div className="pagination-container">
                    <ul className="pagination flex flex-row justify-evenly">
                        { amountOfPages > 3 && currentPage > 2 && (
                            <>
                                <div className='flex flex-row'>
                                    <li
                                        key={1}
                                        onClick={() => paginate(1)}
                                        className={`page-number px-3 py-1 rounded-md ${1 === currentPage ? 'bg-blue-200' : ''}`}
                                    >
                                        1
                                    </li> 
                                </div>
                                <p className='mt-auto'>...</p>
                            </>
                        )}
                        {pageNumbers.map((number) => (
                            <li
                                key={number}
                                onClick={() => paginate(number)}
                                className={`page-number px-3 py-1 rounded-md ${number === currentPage ? 'bg-blue-200' : ''}`}
                            >
                                {number}
                            </li>
                        ))}
                        { amountOfPages > 3 && currentPage < amountOfPages - 1 && (
                            <>
                                <p className='mt-auto'>...</p>
                                <div className='flex flex-row'>
                                    <li
                                        key={lastPage}
                                        onClick={() => paginate(lastPage)}
                                        className={`page-number px-3 py-1 rounded-md ${lastPage === currentPage ? 'bg-blue-200' : ''}`}
                                    >
                                        6
                                    </li> 
                                </div>
                            </>
                        )}
                    </ul>
                </div>
            )}
        </Fragment>
    );
};
 
export default Paginate;