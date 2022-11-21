import { ChangeEventHandler, FC, MouseEventHandler } from "react";

interface PaginationProps {
    dataCnt: number,
    pageInfo: {
        row?: number, // 한 페이지에 나오는 리스트 개수
        currentPage: number, 
        boundaryRange?: number // 화면에 노출되는 페이지 번호 개수
    },
    handlePageChange: (changePage: number) => void // 상위 컴포넌트 현재 페이지 변경 함수
    handlePageRow: (row: number) => void // 상위 컴포넌트 페이지 List 목록 개수 변경 함수
};

const Pagination:FC<PaginationProps> = ({ dataCnt, pageInfo, handlePageChange, handlePageRow }) => {

    const { row = 50, currentPage, boundaryRange = 10 } = pageInfo;
    
    // 페이지 계산
    const paginate = (dataCnt: number) => {
        const maxPage = Math.ceil(dataCnt / row);
        // 끝 페이지 노출 기준점
        const viewPoint = (maxPage - (boundaryRange - 1)) < 1 ? 1 : (maxPage - (boundaryRange - 1));
        const startPage = (currentPage - Math.floor(boundaryRange / 2)) > viewPoint ? viewPoint : (currentPage - Math.floor(boundaryRange / 2));
        const endPage = (currentPage + Math.floor(boundaryRange / 2)) > boundaryRange ? (currentPage + Math.floor(boundaryRange / 2)) : boundaryRange;
        return { maxPage, startPage, endPage };
    };

    // 페이지 정보
    const { maxPage, startPage, endPage } = paginate(dataCnt);

    // 계산 후 페이지 배열 생성
    const pageArr = Array.from({ length: maxPage }, (value, index: number) => index + 1);

    // 페이지 번호 클릭
    const handlePage: MouseEventHandler<HTMLElement> = (e) => {
        const changePage = parseInt(e.currentTarget.innerText);
        handlePageChange(changePage);
    };
    
    // 이전/다음 페이지 이동
    const handleArrowButton: MouseEventHandler<HTMLButtonElement> = (e) => {
        const className = e.currentTarget.className;
        let changePage = 0;

        if (className.includes('prev')) {
            changePage = currentPage - boundaryRange;
            changePage = changePage < 1 ? 1 : changePage;
        }
        else if (className.includes('next')) {
            changePage = currentPage + boundaryRange;
            changePage = changePage > maxPage ? maxPage : changePage;
        };
        handlePageChange(changePage);
    };

    // 리스트 개수 선택
    const rows = [20, 50];
    const handleListRow:ChangeEventHandler<HTMLSelectElement> = (e) => {
        const row = parseInt(e.currentTarget.value);
        handlePageRow(row);
        handlePageChange(1);
    };

    return (
        <>
            {
                !!dataCnt &&
                <div className="paging-wrap">
                    <button className="btn-prev" onClick={handleArrowButton} disabled={currentPage === 1}></button>  {/* <!-- disabled : 비활성화 --> */}
                    <ul className="paging">
                    {
                        pageArr.map(pageNum => {
                            if (pageNum >= startPage && pageNum <= endPage) return <li key={pageNum} onClick={handlePage} className={currentPage === pageNum ? "active" : ""} >{pageNum}</li>
                            // if (pageNum >= startPage && pageNum <= endPage) return <li key={pageNum} onClick={handlePage} className={currentPage === pageNum ? "active" : ""} disabled={currentPage === pageNum}>{pageNum}</li>
                            return true
                        })
                    }
                    </ul>
                    <button className="btn-next" onClick={handleArrowButton} disabled={maxPage === 0 || currentPage === maxPage}></button>  {/* <!-- disabled : 비활성화 --> */}
                </div>
            }
            <select className="filter-number" name="" id="" onChange={handleListRow} value={row}>
                {rows.map(item => <option key={item} value={item} >{item}개</option>)}
            </select>
        </>
    );
};

export default Pagination;