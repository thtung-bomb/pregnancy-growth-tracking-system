import useBlogService from '../../../services/useBlogService';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, Avatar, Tag, Skeleton, Space, Divider, Row, Col, Image, Form, Input, Button, List, Spin, message } from 'antd';
import { CalendarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
import { formatDate } from '../../../utils/formatDate';
import moment from 'moment';
import useOrderService from '../../../services/useOrderService';

const { Title, Paragraph, Text } = Typography;

const BlogDetail = () => {
    const { getBlog, getCommentByBlogId, createComment } = useBlogService();
    const { getOrderByUserId } = useOrderService();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { id } = useParams();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [canComment, setCanComment] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem('USER');
        if (user) {
            setIsLoggedIn(true);
            checkUserOrder(JSON.parse(user).id);
        }
    }, []);

    const checkUserOrder = async (userId) => {
        try {
            const orders = await getOrderByUserId(userId);
            setCanComment(orders.length > 0);
        } catch (error) {
            setCanComment(false);
        }
    };

    useEffect(() => {
        const fetchBlog = async () => {
            setLoading(true);
            try {
                const blogData = await getBlog(id);
                const commentData = await getCommentByBlogId(id);
                setBlog(blogData.data);
                setComments(commentData.length > 0 ? commentData : []);
            } catch (error) {
                message.error('Lấy dữ liệu thất bại');
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
    }, [id, getBlog, getCommentByBlogId]);

    const buildCommentTree = (comments) => {
        const commentMap = {};
        const topLevelComments = [];
        const allReplies = [];

        // Tạo bản đồ và phân loại bình luận
        comments.forEach((comment) => {
            commentMap[comment.id] = { ...comment, replies: [] };
            if (!comment.parent) {
                topLevelComments.push(commentMap[comment.id]);
            } else {
                allReplies.push(commentMap[comment.id]);
            }
        });

        // Gắn tất cả replies vào top-level comments
        topLevelComments.forEach((topComment) => {
            topComment.replies = allReplies.filter(reply =>
                reply.parent && (reply.parent.id === topComment.id || allReplies.some(r => r.id === reply.parent.id))
            );
        });

        return topLevelComments;
    };

    const topLevelComments = useMemo(() => buildCommentTree(comments), [comments]);

    const handlePostComment = async (content, parentId = null) => {
        const user = localStorage.getItem('USER');
        if (!user) {
            message.warning('Bạn cần đăng nhập để bình luận!');
            return;
        }

        setSubmitting(true);
        try {
            const userId = JSON.parse(user).id;
            await createComment({
                content,
                blogId: id,
                userId,
                ...(parentId && { parentId }),
            });
            message.success('Bình luận đã được gửi');
            const updatedComments = await getCommentByBlogId(id);
            setComments(updatedComments);
        } catch (error) {
            message.error('Lỗi khi gửi bình luận!');
        } finally {
            setSubmitting(false);
            setReplyingTo(null);
        }
    };

    if (loading) {
        return <BlogDetailSkeleton />;
    }

    if (!blog) {
        return (
            <Row justify="center" style={{ padding: '40px 0' }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <Card>
                        <div style={{ textAlign: 'center' }}>
                            <Title level={2}>Blog không tìm thấy</Title>
                            <Paragraph type="secondary">
                                Blog bạn tìm không thấy hoặc đã bị gỡ.
                            </Paragraph>
                        </div>
                    </Card>
                </Col>
            </Row>
        );
    }

    const CommentSection = ({ topLevelComments, handlePostComment, replyingTo, setReplyingTo }) => {
        const [commentContent, setCommentContent] = useState('');

        const handleSubmit = async () => {
            if (commentContent.trim()) {
                await handlePostComment(commentContent);
                setCommentContent('');
            }
        };

        return (
            <div style={{ marginTop: 48 }}>
                <Title level={3}>Bình luận</Title>
                {topLevelComments.length > 0 ? (
                    <List
                        dataSource={topLevelComments}
                        renderItem={(comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                handlePostComment={handlePostComment}
                            />
                        )}
                    />
                ) : (
                    <Text type="secondary">Chưa có bình luận nào.</Text>
                )}
                <Divider />
                {isLoggedIn ? (
                    canComment ? (
                        <Form onFinish={handleSubmit}>
                            <Form.Item>
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Viết bình luận của bạn..."
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    Gửi
                                </Button>
                            </Form.Item>
                        </Form>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: 16 }}>
                            <Text type="danger">
                                Bạn cần <a href="/pricing">mua gói</a> để có thể bình luận.
                            </Text>
                        </div>
                    )
                ) : (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Text type="secondary">
                            Bạn cần <a href="/auth/login">đăng nhập</a> để bình luận.
                        </Text>
                    </div>
                )}
            </div>
        );
    };

    const CommentItem = ({ comment, replyingTo, setReplyingTo, handlePostComment }) => {
        const [replyContent, setReplyContent] = useState('');

        const handleReplySubmit = async () => {
            if (replyContent.trim()) {
                await handlePostComment(replyContent, comment.id);
                setReplyContent('');
                setReplyingTo(null);
            }
        };

        return (
            <List.Item>
                <Space align="start" style={{ width: '100%' }}>
                    <Avatar icon={<UserOutlined />} src={comment.user.image} />
                    <div style={{ flex: 1 }}>
                        <Text strong>{comment.user.fullName}</Text>
                        <Paragraph style={{ marginBottom: 4 }}>{comment.content}</Paragraph>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            {moment(comment.createdAt).fromNow()}
                        </Text>
                        <Button type="link" onClick={() => setReplyingTo(comment.id)}>
                            Trả lời
                        </Button>
                        {replyingTo === comment.id && (
                            <Form onFinish={handleReplySubmit} style={{ marginTop: 12 }}>
                                <Form.Item>
                                    <Input.TextArea
                                        rows={2}
                                        placeholder="Viết phản hồi của bạn..."
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={submitting}>
                                        Gửi
                                    </Button>
                                    <Button onClick={() => setReplyingTo(null)} style={{ marginLeft: 8 }}>
                                        Hủy
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}
                        {comment.replies.length > 0 && (
                            <List
                                dataSource={comment.replies}
                                renderItem={(reply) => (
                                    <List.Item key={reply.id}>
                                        <Space align="start" style={{ width: '100%' }}>
                                            <Avatar icon={<UserOutlined />} src={reply.user.image} />
                                            <div style={{ flex: 1 }}>
                                                <Text strong>{reply.user.fullName}</Text>
                                                <Paragraph style={{ marginBottom: 4 }}>{reply.content}</Paragraph>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {moment(reply.createdAt).fromNow()}
                                                </Text>
                                            </div>
                                        </Space>
                                    </List.Item>
                                )}
                                style={{ marginTop: 12, paddingLeft: 32, borderLeft: '2px solid #eee' }}
                            />
                        )}
                    </div>
                </Space>
            </List.Item>
        );
    };

    return (
        <Row justify="center" style={{ padding: '40px 0' }}>
            <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <Title level={1} style={{ marginBottom: 16 }}>
                        {blog.title}
                    </Title>
                    <Space split={<Divider type="vertical" />} wrap style={{ marginBottom: 16 }}>
                        <Space>
                            <CalendarOutlined />
                            <Text type="secondary">{formatDate(blog.createdAt)}</Text>
                        </Space>
                        {blog.category && (
                            <Space>
                                <TagOutlined />
                                <Tag color="blue">{blog.category.name}</Tag>
                            </Space>
                        )}
                    </Space>
                    {blog.user && (
                        <Space style={{ marginBottom: 24 }}>
                            <Avatar src={blog.user.image} size="large" icon={<UserOutlined />} />
                            <div>
                                <Text type="secondary">Viết bởi</Text>
                                <div>{blog.user.username}</div>
                            </div>
                        </Space>
                    )}
                </div>

                {/* Featured Image */}
                {blog.image && (
                    <div style={{ marginBottom: 24 }}>
                        <Image
                            src={blog.image || 'https://picsum.photos/id/237/200/300'}
                            alt={blog.title}
                            style={{ width: '100%', borderRadius: 8 }}
                            preview={false}
                        />
                    </div>
                )}

                {/* Description */}
                <Card style={{ marginBottom: 24 }}>
                    <Paragraph italic type="secondary" style={{ fontSize: 16 }}>
                        {blog.description}
                    </Paragraph>
                </Card>

                {/* Content */}
                <Card>
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                </Card>

                <CommentSection
                    topLevelComments={topLevelComments}
                    handlePostComment={handlePostComment}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                />
            </Col>
        </Row>
    );

    function BlogDetailSkeleton() {
        return (
            <Row justify="center" style={{ padding: '40px 0' }}>
                <Col xs={22} sm={20} md={18} lg={16} xl={14}>
                    <div style={{ marginBottom: 24 }}>
                        <Skeleton.Input style={{ width: '75%', height: 40 }} active />
                        <div style={{ display: 'flex', gap: 16, marginTop: 16, marginBottom: 16 }}>
                            <Skeleton.Input style={{ width: 120 }} active />
                            <Skeleton.Input style={{ width: 120 }} active />
                            <Skeleton.Input style={{ width: 80 }} active />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <Skeleton.Avatar active size="large" />
                            <div>
                                <Skeleton.Input style={{ width: 100 }} active />
                                <Skeleton.Input style={{ width: 150, marginTop: 8 }} active />
                            </div>
                        </div>
                    </div>
                    <Skeleton.Image style={{ width: '100%', height: 400 }} active />
                    <div style={{ marginTop: 24 }}>
                        <Skeleton active paragraph={{ rows: 10 }} />
                    </div>
                </Col>
            </Row>
        );
    }
};

export default BlogDetail;

// import useBlogService from '../../../services/useBlogService';
// import { useEffect, useState, useMemo } from 'react';
// import { useParams } from 'react-router-dom';
// import { Typography, Card, Avatar, Tag, Skeleton, Space, Divider, Row, Col, Image, Form, Input, Button, List, Spin, message } from 'antd';
// import { CalendarOutlined, UserOutlined, TagOutlined } from '@ant-design/icons';
// import { formatDate } from '../../../utils/formatDate';
// import moment from 'moment';
// import useOrderService from '../../../services/useOrderService';

// const { Title, Paragraph, Text } = Typography;

// const BlogDetail = () => {
//     const { getBlog, getCommentByBlogId, createComment } = useBlogService();
//     const { getOrderByUserId } = useOrderService();
//     const [blog, setBlog] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [comments, setComments] = useState([]);
//     const [replyingTo, setReplyingTo] = useState(null);
//     const [submitting, setSubmitting] = useState(false);
//     const { id } = useParams();
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [canComment, setCanComment] = useState(false);

//     useEffect(() => {
//         const user = localStorage.getItem('USER');
//         if (user) {
//             setIsLoggedIn(true);
//             checkUserOrder(JSON.parse(user).id);
//         }
//     }, []);

//     const checkUserOrder = async (userId) => {
//         try {
//             const orders = await getOrderByUserId(userId);
//             setCanComment(orders.length > 0);
//         } catch (error) {
//             setCanComment(false);
//         }
//     };

//     useEffect(() => {
//         const fetchBlog = async () => {
//             setLoading(true);
//             try {
//                 const blogData = await getBlog(id);
//                 const commentData = await getCommentByBlogId(id);
//                 setBlog(blogData.data);
//                 setComments(commentData.length > 0 ? commentData : []);
//             } catch (error) {
//                 message.error('Lấy dữ liệu thất bại');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchBlog();
//     }, [id, getBlog, getCommentByBlogId]);

//     const shouldShowComments = comments.length > 0;

//     const buildCommentTree = (comments) => {
//         const commentMap = {};
//         comments.forEach((comment) => {
//             commentMap[comment.id] = { ...comment, replies: [] };
//         });
//         const topLevelComments = [];
//         comments.forEach((comment) => {
//             if (comment.parent) {
//                 const parentId = comment.parent.id;
//                 if (commentMap[parentId]) {
//                     commentMap[parentId].replies.push(commentMap[comment.id]);
//                 }
//             } else {
//                 topLevelComments.push(commentMap[comment.id]);
//             }
//         });
//         return topLevelComments;
//     };

//     const topLevelComments = useMemo(() => buildCommentTree(comments), [comments]);

//     const handlePostComment = async (content, parentId = null) => {
//         const user = localStorage.getItem('USER');
//         if (!user) {
//             message.warning('Bạn cần đăng nhập để bình luận!');
//             return;
//         }

//         setSubmitting(true);
//         try {
//             const userId = JSON.parse(user).id; // Giả sử USER lưu dưới dạng JSON và có id
//             await createComment({
//                 content,
//                 blogId: id,
//                 userId,
//                 ...(parentId && { parentId }),
//             });
//             message.success('Bình luận đã được gửi');
//             const updatedComments = await getCommentByBlogId(id);
//             setComments(updatedComments);
//         } catch (error) {
//             message.error('Lỗi khi gửi bình luận!');
//         } finally {
//             setSubmitting(false);
//         }
//     };


//     if (loading) {
//         return <BlogDetailSkeleton />;
//     }

//     if (!blog) {
//         return (
//             <Row justify="center" style={{ padding: '40px 0' }}>
//                 <Col xs={22} sm={20} md={18} lg={16} xl={14}>
//                     <Card>
//                         <div style={{ textAlign: 'center' }}>
//                             <Title level={2}>Blog không tìm thấy</Title>
//                             <Paragraph type="secondary">
//                                 Blog bạn tìm không thấy hoặc đã bị gỡ.
//                             </Paragraph>
//                         </div>
//                     </Card>
//                 </Col>
//             </Row>
//         );
//     }

//     const CommentSection = ({ topLevelComments, handlePostComment, replyingTo, setReplyingTo }) => {
//         const [commentContent, setCommentContent] = useState('');

//         const handleSubmit = async () => {
//             if (commentContent.trim()) {
//                 await handlePostComment(commentContent);
//                 setCommentContent('');
//             }
//         };

//         return (
//             <div style={{ marginTop: 48 }}>
//                 <Title level={3}>Bình luận</Title>
//                 <List
//                     dataSource={topLevelComments}
//                     renderItem={(comment) => (
//                         <CommentItem
//                             key={comment.id}
//                             comment={comment}
//                             replyingTo={replyingTo}
//                             setReplyingTo={setReplyingTo}
//                             handlePostComment={handlePostComment}
//                         />
//                     )}
//                 />
//                 <Divider />
//                 {isLoggedIn ? (
//                     canComment ? (
//                         <>
//                             {shouldShowComments && (
//                                 <CommentSection
//                                     topLevelComments={topLevelComments}
//                                     handlePostComment={handlePostComment}
//                                     replyingTo={replyingTo}
//                                     setReplyingTo={setReplyingTo}
//                                 />
//                             )}
//                             <Form onFinish={handleSubmit}>
//                                 <Form.Item>
//                                     <Input.TextArea
//                                         rows={4}
//                                         placeholder="Viết bình luận của bạn..."
//                                         value={commentContent}
//                                         onChange={(e) => setCommentContent(e.target.value)}
//                                     />
//                                 </Form.Item>
//                                 <Form.Item>
//                                     <Button type="primary" htmlType="submit" loading={submitting}>
//                                         Gửi
//                                     </Button>
//                                 </Form.Item>
//                             </Form>
//                         </>
//                     ) : (
//                         <div style={{ textAlign: 'center', marginTop: 16 }}>
//                             <Text type="danger">
//                                 Bạn cần <a href="/pricing">mua gói</a> để có thể bình luận.
//                             </Text>
//                         </div>
//                     )
//                 ) : (
//                     <div style={{ textAlign: 'center', marginTop: 16 }}>
//                         <Text type="secondary">
//                             Bạn cần <a href="/auth/login">đăng nhập</a> để bình luận.
//                         </Text>
//                     </div>
//                 )}
//             </div>
//         );
//     }

//     const CommentItem = ({ comment, replyingTo, setReplyingTo, handlePostComment }) => {
//         const [replyContent, setReplyContent] = useState('');

//         const handleReplySubmit = async () => {
//             if (replyContent.trim()) {
//                 await handlePostComment(replyContent, comment.id);
//                 setReplyContent('');
//                 setReplyingTo(null);
//             }
//         };

//         return (
//             <List.Item>
//                 <Space align="start" style={{ width: '100%' }}>
//                     <Avatar icon={<UserOutlined />} src={comment.user.image} />
//                     <div style={{ flex: 1 }}>
//                         <Text strong>{comment.user.fullName}</Text>
//                         <Paragraph style={{ marginBottom: 4 }}>{comment.content}</Paragraph>
//                         <Text type="secondary" style={{ fontSize: 12 }}>
//                             {moment(comment.createdAt).fromNow()}
//                         </Text>
//                         <Button type="link" onClick={() => setReplyingTo(comment.id)}>
//                             Trả lời
//                         </Button>
//                         {replyingTo === comment.id && (
//                             <Form onFinish={handleReplySubmit} style={{ marginTop: 12 }}>
//                                 <Form.Item>
//                                     <Input.TextArea
//                                         rows={2}
//                                         placeholder="Viết phản hồi của bạn..."
//                                         value={replyContent}
//                                         onChange={(e) => setReplyContent(e.target.value)}
//                                     />
//                                 </Form.Item>
//                                 <Form.Item>
//                                     <Button type="primary" htmlType="submit" loading={submitting}>
//                                         Gửi
//                                     </Button>
//                                     <Button onClick={() => setReplyingTo(null)} style={{ marginLeft: 8 }}>
//                                         Hủy
//                                     </Button>
//                                 </Form.Item>
//                             </Form>
//                         )}
//                         {comment.replies.length > 0 && (
//                             <List
//                                 dataSource={comment.replies}
//                                 renderItem={(reply) => (
//                                     <CommentItem
//                                         key={reply.id}
//                                         comment={reply}
//                                         replyingTo={replyingTo}
//                                         setReplyingTo={setReplyingTo}
//                                         handlePostComment={handlePostComment}
//                                     />
//                                 )}
//                                 style={{ marginTop: 12, paddingLeft: 32, borderLeft: '2px solid #eee' }}
//                             />
//                         )}
//                     </div>
//                 </Space>
//             </List.Item>
//         );
//     };

//     return (
//         <Row justify="center" style={{ padding: '40px 0' }}>
//             <Col xs={22} sm={20} md={18} lg={16} xl={14}>
//                 {/* Header */}
//                 <div style={{ marginBottom: 24 }}>
//                     <Title level={1} style={{ marginBottom: 16 }}>
//                         {blog.title}
//                     </Title>
//                     <Space split={<Divider type="vertical" />} wrap style={{ marginBottom: 16 }}>
//                         <Space>
//                             <CalendarOutlined />
//                             <Text type="secondary">{formatDate(blog.createdAt)}</Text>
//                         </Space>
//                         {blog.category && (
//                             <Space>
//                                 <TagOutlined />
//                                 <Tag color="blue">{blog.category.name}</Tag>
//                             </Space>
//                         )}
//                     </Space>
//                     {blog.user && (
//                         <Space style={{ marginBottom: 24 }}>
//                             <Avatar src={blog.user.image} size="large" icon={<UserOutlined />} />
//                             <div>
//                                 <Text type="secondary">Viết bởi</Text>
//                                 <div>{blog.user.username}</div>
//                             </div>
//                         </Space>
//                     )}
//                 </div>

//                 {/* Featured Image */}
//                 {blog.image && (
//                     <div style={{ marginBottom: 24 }}>
//                         <Image
//                             src={blog.image || 'https://picsum.photos/id/237/200/300'}
//                             alt={blog.title}
//                             style={{ width: '100%', borderRadius: 8 }}
//                             preview={false}
//                         />
//                     </div>
//                 )}

//                 {/* Description */}
//                 <Card style={{ marginBottom: 24 }}>
//                     <Paragraph italic type="secondary" style={{ fontSize: 16 }}>
//                         {blog.description}
//                     </Paragraph>
//                 </Card>

//                 {/* Content */}
//                 <Card>
//                     <div dangerouslySetInnerHTML={{ __html: blog.content }} />
//                 </Card>

//                 <CommentSection
//                     topLevelComments={topLevelComments}
//                     handlePostComment={handlePostComment}
//                     replyingTo={replyingTo}
//                     setReplyingTo={setReplyingTo}
//                 />
//             </Col>
//         </Row>
//     );

//     function BlogDetailSkeleton() {
//         return (
//             <Row justify="center" style={{ padding: '40px 0' }}>
//                 <Col xs={22} sm={20} md={18} lg={16} xl={14}>
//                     <div style={{ marginBottom: 24 }}>
//                         <Skeleton.Input style={{ width: '75%', height: 40 }} active />
//                         <div style={{ display: 'flex', gap: 16, marginTop: 16, marginBottom: 16 }}>
//                             <Skeleton.Input style={{ width: 120 }} active />
//                             <Skeleton.Input style={{ width: 120 }} active />
//                             <Skeleton.Input style={{ width: 80 }} active />
//                         </div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
//                             <Skeleton.Avatar active size="large" />
//                             <div>
//                                 <Skeleton.Input style={{ width: 100 }} active />
//                                 <Skeleton.Input style={{ width: 150, marginTop: 8 }} active />
//                             </div>
//                         </div>
//                     </div>
//                     <Skeleton.Image style={{ width: '100%', height: 400 }} active />
//                     <div style={{ marginTop: 24 }}>
//                         <Skeleton active paragraph={{ rows: 10 }} />
//                     </div>
//                 </Col>
//             </Row>
//         );
//     }
// };

// export default BlogDetail;