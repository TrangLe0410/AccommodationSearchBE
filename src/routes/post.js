import express from 'express'
import * as postController from '../controllers/post'
import verifyToken from '../middlewares/verifyToken'
const router = express.Router()

router.get('/all', postController.getPosts)
router.get('/limit', postController.getPostsLimit)
router.get('/new-post', postController.getNewPosts)
router.get('/by-star', postController.getPostsByStar);
router.get('/related-posts', postController.getRelatedPosts);
router.post('/updateStar', postController.updatePostStarController);

router.use(verifyToken)
router.post('/create-new', postController.createNewPost)
router.get('/limit-admin', postController.getPostsLimitAdmin)
router.put('/update-post', postController.updatePost)
router.delete('/delete-post', postController.deletePost)
router.put('/approve-post', postController.approvePost)
router.put('/cancel-post', postController.cancelPost);
router.post('/mark-post', postController.markPost);
router.get('/get-marked-posts', postController.getMarkedPosts);
router.put('/hide-post', postController.hidePost)
router.put('/visible-post', postController.visiblePost)
router.get('/count-allPost', postController.countPosts)
router.get('/count-this-month', postController.countPostsThisMonth);
router.get('/count-post-moth', postController.countPostsByMonth);
router.get('/count-post-by-province', postController.getDistrictPostCountController);
export default router