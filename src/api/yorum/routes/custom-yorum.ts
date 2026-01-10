export default {
  routes: [
    {
      method: 'GET',
      path: '/yorumlar/haber/:haberId',
      handler: 'yorum.findByHaber',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/yorumlar/haber/:haberId',
      handler: 'yorum.createForHaber',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    },
    {
      method: 'POST',
      path: '/yorumlar/:id/like',
      handler: 'yorum.like',
      config: {
        auth: false,
        policies: [],
        middlewares: []
      }
    }
  ]
};
