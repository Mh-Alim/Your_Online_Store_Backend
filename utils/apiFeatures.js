class ApiFeature{
    constructor(query,queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword ? { 
            name : {
                $regex : this.queryStr.keyword,
                $options : "i"
            }
         } : {};
         this.query = this.query.find(keyword);
         return this;
    }

    filter(){
        let copyQueryStr = {...this.queryStr};
        const rm = ["page","limit","keyword"];
        rm.forEach(ele => {
            delete copyQueryStr[ele];
        });

        // filter for price and rating 
        let queryStr = JSON.stringify(copyQueryStr);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (val) => `$${val}`);
        copyQueryStr = JSON.parse(queryStr);
        this.query = this.query.find(copyQueryStr);
        return this;
    }

    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage*(currentPage-1);
        this.query = this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

module.exports = ApiFeature;