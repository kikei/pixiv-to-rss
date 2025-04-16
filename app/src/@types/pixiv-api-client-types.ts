    export type IllustType = 'illust' | 'manga';

    interface ImageUrls {
      sequare_medium?: string;
      medium?: string;
      large?: string;
      original?: string;
    }

    export interface User {
      id: number;
      name: string;
      account: string;
      profile_image_urls: ImageUrls;
      is_followed: boolean;
      is_access_blocking_user: boolean;
    }

    export interface Illust {
      id: number;
      title: string;
      type: IllustType;
      image_urls: ImageUrls;
      caption: string;
      restrict: number;
      user: User;
      tags: {
        name: string;
        translated_name: string;
      }[];
      tools: string[];
      create_date: string;
      page_count: number;
      width: number;
      height: number;
      sanity_level: number;
      x_restrict: number;
      series: unknown;
      meta_single_page: {
        original_image_url: string;
      };
      meta_pages: unknown[];
      total_view: number;
      total_bookmarks: {
        image_urls: ImageUrls
      }[];
      is_bookmarked: boolean;
      visible: boolean;
      is_muted: boolean;
      total_commnets: number;
      illust_ai_type: number;
      illust_book_style: number;
    }

    interface MyUser {
      profile_image_url: {
        px_16x16: string;
        px_50x50: string;
        px_170x170: string;
      };
      id: string;
      name: string;
      account: string;
      mail_address: string;
      is_premium: boolean;
      x_restrict: number;
      is_mail_authorized: boolean;
      require_policy_agreement: boolean;
    }

    export interface RefreshAccessTokenResponse {
      token_type: 'bearer';
      scope: string;
      access_token: string;
      refresh_token: string;
      expires_in: number;
      user: MyUser;
    }

