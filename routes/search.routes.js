const router = require("express").Router({ mergeParams: true });

const SearchController = require("../app/controller/search.controller");
router.route("/product").get(SearchController.searchForProducts);
router.route("/post").get(SearchController.searchForPosts);
router.route("/shop").get(SearchController.searchForShops);
router.route("/all").get(SearchController.searchForAllTypes);

module.exports = router;
