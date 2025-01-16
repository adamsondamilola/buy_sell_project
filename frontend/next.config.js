module.exports = {
    env: {
      baseUrl: process.env.NODE_ENV === 'dev'? process.env.API_URL : process.env.API_URL_LIVE,
      website: process.env.NEXTAUTH_URL,
      publicUrl: process.env.NEXT_PUBLIC_SITE_URL
      },
            
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${this.env.baseUrl}:path*` // Proxy to Backend
      }
    ]
  }
   
  }