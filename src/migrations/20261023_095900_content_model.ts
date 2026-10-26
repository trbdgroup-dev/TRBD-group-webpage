import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "payload"."enum_pages_blocks_section_intro_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_verticals_list_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_approach_stages_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_why_points_points_icon" AS ENUM('user-round', 'shield-check', 'briefcase', 'chart-column', 'globe', 'file-text', 'handshake', 'clock');
  CREATE TYPE "payload"."enum_pages_blocks_why_points_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_image_text_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "payload"."enum_pages_blocks_call_to_action_button_type" AS ENUM('page', 'vertical', 'anchor', 'external');
  CREATE TYPE "payload"."enum_pages_blocks_call_to_action_button_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_blocks_contact_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__pages_v_blocks_section_intro_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_verticals_list_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_approach_stages_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_why_points_points_icon" AS ENUM('user-round', 'shield-check', 'briefcase', 'chart-column', 'globe', 'file-text', 'handshake', 'clock');
  CREATE TYPE "payload"."enum__pages_v_blocks_why_points_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_image_text_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_image_text_image_side" AS ENUM('left', 'right');
  CREATE TYPE "payload"."enum__pages_v_blocks_call_to_action_button_type" AS ENUM('page', 'vertical', 'anchor', 'external');
  CREATE TYPE "payload"."enum__pages_v_blocks_call_to_action_button_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_blocks_contact_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_verticals_slug" AS ENUM('manpower', 'education-training', 'oil-gas', 'green-energy', 'global-business');
  CREATE TYPE "payload"."enum_verticals_copy_status" AS ENUM('draft-needs-review', 'reviewed');
  CREATE TYPE "payload"."enum_verticals_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum__verticals_v_version_slug" AS ENUM('manpower', 'education-training', 'oil-gas', 'green-energy', 'global-business');
  CREATE TYPE "payload"."enum__verticals_v_version_copy_status" AS ENUM('draft-needs-review', 'reviewed');
  CREATE TYPE "payload"."enum__verticals_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "payload"."enum_users_role" AS ENUM('super-admin', 'content-editor');
  CREATE TYPE "payload"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "payload"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "payload"."enum_site_settings_social_links_platform" AS ENUM('linkedin', 'facebook', 'instagram', 'x', 'youtube');
  CREATE TYPE "payload"."enum_navigation_header_links_link_type" AS ENUM('page', 'vertical', 'anchor', 'external');
  CREATE TYPE "payload"."enum_navigation_header_links_link_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_navigation_footer_links_link_type" AS ENUM('page', 'vertical', 'anchor', 'external');
  CREATE TYPE "payload"."enum_navigation_footer_links_link_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TYPE "payload"."enum_navigation_header_cta_link_type" AS ENUM('page', 'vertical', 'anchor', 'external');
  CREATE TYPE "payload"."enum_navigation_header_cta_link_anchor" AS ENUM('about', 'verticals', 'approach', 'why', 'contact');
  CREATE TABLE "payload"."pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'TRBD Consulting Group',
  	"title" varchar,
  	"cta_label" varchar DEFAULT 'Explore our verticals',
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_section_intro_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_verticals_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_verticals_list_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_approach_stages_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_approach_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_approach_stages_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_why_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "payload"."enum_pages_blocks_why_points_points_icon" DEFAULT 'user-round',
  	"text" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_why_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_why_points_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_image_text_anchor",
  	"image_id" integer,
  	"image_side" "payload"."enum_pages_blocks_image_text_image_side" DEFAULT 'right',
  	"label" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_type" "payload"."enum_pages_blocks_call_to_action_button_type" DEFAULT 'page',
  	"button_new_tab" boolean,
  	"button_page_id" integer,
  	"button_vertical_id" integer,
  	"button_anchor" "payload"."enum_pages_blocks_call_to_action_button_anchor",
  	"button_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum_pages_blocks_contact_anchor" DEFAULT 'contact',
  	"label" varchar DEFAULT 'Contact',
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Email us',
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar DEFAULT 'TRBD Consulting Group',
  	"title" varchar,
  	"cta_label" varchar DEFAULT 'Explore our verticals',
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_section_intro_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"text" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_verticals_list" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_verticals_list_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_approach_stages_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_approach_stages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_approach_stages_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_why_points_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"icon" "payload"."enum__pages_v_blocks_why_points_points_icon" DEFAULT 'user-round',
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_why_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_why_points_anchor",
  	"label" varchar,
  	"heading" varchar,
  	"intro" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_image_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_image_text_anchor",
  	"image_id" integer,
  	"image_side" "payload"."enum__pages_v_blocks_image_text_image_side" DEFAULT 'right',
  	"label" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_testimonials_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"name" varchar,
  	"role" varchar,
  	"company" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_call_to_action" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar,
  	"button_type" "payload"."enum__pages_v_blocks_call_to_action_button_type" DEFAULT 'page',
  	"button_new_tab" boolean,
  	"button_page_id" integer,
  	"button_vertical_id" integer,
  	"button_anchor" "payload"."enum__pages_v_blocks_call_to_action_button_anchor",
  	"button_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_contact" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"anchor" "payload"."enum__pages_v_blocks_contact_anchor" DEFAULT 'contact',
  	"label" varchar DEFAULT 'Contact',
  	"heading" varchar,
  	"text" varchar,
  	"button_label" varchar DEFAULT 'Email us',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "payload"."_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."verticals_who_we_work_with" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "payload"."verticals_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"summary" varchar,
  	"description" jsonb
  );
  
  CREATE TABLE "payload"."verticals_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "payload"."verticals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"title" varchar,
  	"hero_headline" varchar,
  	"summary" varchar,
  	"hero_image_id" integer,
  	"how_we_deliver" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_no_index" boolean DEFAULT false,
  	"slug" "payload"."enum_verticals_slug",
  	"order" numeric DEFAULT 1,
  	"copy_status" "payload"."enum_verticals_copy_status" DEFAULT 'draft-needs-review',
  	"notification_email" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "payload"."enum_verticals_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "payload"."_verticals_v_version_who_we_work_with" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_verticals_v_version_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"summary" varchar,
  	"description" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_verticals_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "payload"."_verticals_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_title" varchar,
  	"version_hero_headline" varchar,
  	"version_summary" varchar,
  	"version_hero_image_id" integer,
  	"version_how_we_deliver" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_no_index" boolean DEFAULT false,
  	"version_slug" "payload"."enum__verticals_v_version_slug",
  	"version_order" numeric DEFAULT 1,
  	"version_copy_status" "payload"."enum__verticals_v_version_copy_status" DEFAULT 'draft-needs-review',
  	"version_notification_email" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "payload"."enum__verticals_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "payload"."payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "payload"."enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "payload"."enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload"."payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "payload"."enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "payload"."enum_site_settings_social_links_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "payload"."site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'TRBD Consulting Group' NOT NULL,
  	"legal_name" varchar DEFAULT 'TRBD Consulting Group Private Limited' NOT NULL,
  	"tagline" varchar DEFAULT 'People, skills, energy and markets under one roof.',
  	"logo_id" integer,
  	"contact_email" varchar DEFAULT 'contact@trbdgroup.com' NOT NULL,
  	"phone" varchar,
  	"office_address" varchar,
  	"working_hours" varchar,
  	"default_og_image_id" integer,
  	"google_verification" varchar,
  	"bing_verification" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload"."navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_type" "payload"."enum_navigation_header_links_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_page_id" integer,
  	"link_vertical_id" integer,
  	"link_anchor" "payload"."enum_navigation_header_links_link_anchor",
  	"link_url" varchar
  );
  
  CREATE TABLE "payload"."navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_label" varchar NOT NULL,
  	"link_type" "payload"."enum_navigation_footer_links_link_type" DEFAULT 'page',
  	"link_new_tab" boolean,
  	"link_page_id" integer,
  	"link_vertical_id" integer,
  	"link_anchor" "payload"."enum_navigation_footer_links_link_anchor",
  	"link_url" varchar
  );
  
  CREATE TABLE "payload"."navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"header_cta_link_label" varchar NOT NULL,
  	"header_cta_link_type" "payload"."enum_navigation_header_cta_link_type" DEFAULT 'page',
  	"header_cta_link_new_tab" boolean,
  	"header_cta_link_page_id" integer,
  	"header_cta_link_vertical_id" integer,
  	"header_cta_link_anchor" "payload"."enum_navigation_header_cta_link_anchor",
  	"header_cta_link_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "payload"."users" ADD COLUMN "name" varchar;
  ALTER TABLE "payload"."users" ADD COLUMN "role" "payload"."enum_users_role" DEFAULT 'content-editor' NOT NULL;
  ALTER TABLE "payload"."media" ADD COLUMN "caption" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "credit" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "source_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_width" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_height" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_mime_type" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_filesize" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_thumbnail_filename" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_width" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_height" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_mime_type" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_filesize" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_hero_filename" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_url" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_width" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_height" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_mime_type" varchar;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_filesize" numeric;
  ALTER TABLE "payload"."media" ADD COLUMN "sizes_og_filename" varchar;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD COLUMN "verticals_id" integer;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_section_intro" ADD CONSTRAINT "pages_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_verticals_list" ADD CONSTRAINT "pages_blocks_verticals_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_approach_stages_stages" ADD CONSTRAINT "pages_blocks_approach_stages_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_approach_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_approach_stages" ADD CONSTRAINT "pages_blocks_approach_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_why_points_points" ADD CONSTRAINT "pages_blocks_why_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_why_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_why_points" ADD CONSTRAINT "pages_blocks_why_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_image_text" ADD CONSTRAINT "pages_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_testimonials_items" ADD CONSTRAINT "pages_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_testimonials" ADD CONSTRAINT "pages_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_button_vertical_id_verticals_id_fk" FOREIGN KEY ("button_vertical_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_call_to_action" ADD CONSTRAINT "pages_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_contact" ADD CONSTRAINT "pages_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."pages" ADD CONSTRAINT "pages_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_section_intro" ADD CONSTRAINT "_pages_v_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_verticals_list" ADD CONSTRAINT "_pages_v_blocks_verticals_list_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_approach_stages_stages" ADD CONSTRAINT "_pages_v_blocks_approach_stages_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_approach_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_approach_stages" ADD CONSTRAINT "_pages_v_blocks_approach_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_why_points_points" ADD CONSTRAINT "_pages_v_blocks_why_points_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_why_points"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_why_points" ADD CONSTRAINT "_pages_v_blocks_why_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_image_text" ADD CONSTRAINT "_pages_v_blocks_image_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials_items" ADD CONSTRAINT "_pages_v_blocks_testimonials_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v_blocks_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials" ADD CONSTRAINT "_pages_v_blocks_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_button_page_id_pages_id_fk" FOREIGN KEY ("button_page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_button_vertical_id_verticals_id_fk" FOREIGN KEY ("button_vertical_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_call_to_action" ADD CONSTRAINT "_pages_v_blocks_call_to_action_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_contact" ADD CONSTRAINT "_pages_v_blocks_contact_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_pages_v" ADD CONSTRAINT "_pages_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."verticals_who_we_work_with" ADD CONSTRAINT "verticals_who_we_work_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."verticals_services" ADD CONSTRAINT "verticals_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."verticals_faqs" ADD CONSTRAINT "verticals_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."verticals" ADD CONSTRAINT "verticals_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."verticals" ADD CONSTRAINT "verticals_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v_version_who_we_work_with" ADD CONSTRAINT "_verticals_v_version_who_we_work_with_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_verticals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v_version_services" ADD CONSTRAINT "_verticals_v_version_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_verticals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v_version_faqs" ADD CONSTRAINT "_verticals_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."_verticals_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v" ADD CONSTRAINT "_verticals_v_parent_id_verticals_id_fk" FOREIGN KEY ("parent_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v" ADD CONSTRAINT "_verticals_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."_verticals_v" ADD CONSTRAINT "_verticals_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."site_settings" ADD CONSTRAINT "site_settings_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "payload"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_header_links" ADD CONSTRAINT "navigation_header_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_header_links" ADD CONSTRAINT "navigation_header_links_link_vertical_id_verticals_id_fk" FOREIGN KEY ("link_vertical_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_link_vertical_id_verticals_id_fk" FOREIGN KEY ("link_vertical_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "payload"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."navigation" ADD CONSTRAINT "navigation_header_cta_link_page_id_pages_id_fk" FOREIGN KEY ("header_cta_link_page_id") REFERENCES "payload"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload"."navigation" ADD CONSTRAINT "navigation_header_cta_link_vertical_id_verticals_id_fk" FOREIGN KEY ("header_cta_link_vertical_id") REFERENCES "payload"."verticals"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_order_idx" ON "payload"."pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "payload"."pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "payload"."pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_hero_background_image_idx" ON "payload"."pages_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_section_intro_order_idx" ON "payload"."pages_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_section_intro_parent_id_idx" ON "payload"."pages_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_section_intro_path_idx" ON "payload"."pages_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_verticals_list_order_idx" ON "payload"."pages_blocks_verticals_list" USING btree ("_order");
  CREATE INDEX "pages_blocks_verticals_list_parent_id_idx" ON "payload"."pages_blocks_verticals_list" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_verticals_list_path_idx" ON "payload"."pages_blocks_verticals_list" USING btree ("_path");
  CREATE INDEX "pages_blocks_approach_stages_stages_order_idx" ON "payload"."pages_blocks_approach_stages_stages" USING btree ("_order");
  CREATE INDEX "pages_blocks_approach_stages_stages_parent_id_idx" ON "payload"."pages_blocks_approach_stages_stages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_approach_stages_order_idx" ON "payload"."pages_blocks_approach_stages" USING btree ("_order");
  CREATE INDEX "pages_blocks_approach_stages_parent_id_idx" ON "payload"."pages_blocks_approach_stages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_approach_stages_path_idx" ON "payload"."pages_blocks_approach_stages" USING btree ("_path");
  CREATE INDEX "pages_blocks_why_points_points_order_idx" ON "payload"."pages_blocks_why_points_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_points_points_parent_id_idx" ON "payload"."pages_blocks_why_points_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_points_order_idx" ON "payload"."pages_blocks_why_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_why_points_parent_id_idx" ON "payload"."pages_blocks_why_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_why_points_path_idx" ON "payload"."pages_blocks_why_points" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_order_idx" ON "payload"."pages_blocks_image_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_image_text_parent_id_idx" ON "payload"."pages_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_image_text_path_idx" ON "payload"."pages_blocks_image_text" USING btree ("_path");
  CREATE INDEX "pages_blocks_image_text_image_idx" ON "payload"."pages_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "payload"."pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "payload"."pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "payload"."pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "payload"."pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "payload"."pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_testimonials_items_order_idx" ON "payload"."pages_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_items_parent_id_idx" ON "payload"."pages_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_order_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "pages_blocks_testimonials_parent_id_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_testimonials_path_idx" ON "payload"."pages_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_order_idx" ON "payload"."pages_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "pages_blocks_call_to_action_parent_id_idx" ON "payload"."pages_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_call_to_action_path_idx" ON "payload"."pages_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "pages_blocks_call_to_action_button_button_page_idx" ON "payload"."pages_blocks_call_to_action" USING btree ("button_page_id");
  CREATE INDEX "pages_blocks_call_to_action_button_button_vertical_idx" ON "payload"."pages_blocks_call_to_action" USING btree ("button_vertical_id");
  CREATE INDEX "pages_blocks_contact_order_idx" ON "payload"."pages_blocks_contact" USING btree ("_order");
  CREATE INDEX "pages_blocks_contact_parent_id_idx" ON "payload"."pages_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contact_path_idx" ON "payload"."pages_blocks_contact" USING btree ("_path");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "payload"."pages_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "pages_seo_seo_og_image_idx" ON "payload"."pages" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "payload"."pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "payload"."pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "payload"."pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "payload"."pages" USING btree ("_status");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_hero_background_image_idx" ON "payload"."_pages_v_blocks_hero" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_section_intro_order_idx" ON "payload"."_pages_v_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_section_intro_parent_id_idx" ON "payload"."_pages_v_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_section_intro_path_idx" ON "payload"."_pages_v_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_verticals_list_order_idx" ON "payload"."_pages_v_blocks_verticals_list" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_verticals_list_parent_id_idx" ON "payload"."_pages_v_blocks_verticals_list" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_verticals_list_path_idx" ON "payload"."_pages_v_blocks_verticals_list" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_approach_stages_stages_order_idx" ON "payload"."_pages_v_blocks_approach_stages_stages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_approach_stages_stages_parent_id_idx" ON "payload"."_pages_v_blocks_approach_stages_stages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_approach_stages_order_idx" ON "payload"."_pages_v_blocks_approach_stages" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_approach_stages_parent_id_idx" ON "payload"."_pages_v_blocks_approach_stages" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_approach_stages_path_idx" ON "payload"."_pages_v_blocks_approach_stages" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_why_points_points_order_idx" ON "payload"."_pages_v_blocks_why_points_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_points_points_parent_id_idx" ON "payload"."_pages_v_blocks_why_points_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_points_order_idx" ON "payload"."_pages_v_blocks_why_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_why_points_parent_id_idx" ON "payload"."_pages_v_blocks_why_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_why_points_path_idx" ON "payload"."_pages_v_blocks_why_points" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_order_idx" ON "payload"."_pages_v_blocks_image_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_image_text_parent_id_idx" ON "payload"."_pages_v_blocks_image_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_image_text_path_idx" ON "payload"."_pages_v_blocks_image_text" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_image_text_image_idx" ON "payload"."_pages_v_blocks_image_text" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "payload"."_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "payload"."_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "payload"."_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "payload"."_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "payload"."_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_testimonials_items_order_idx" ON "payload"."_pages_v_blocks_testimonials_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_items_parent_id_idx" ON "payload"."_pages_v_blocks_testimonials_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_order_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_testimonials_parent_id_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_testimonials_path_idx" ON "payload"."_pages_v_blocks_testimonials" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_call_to_action_order_idx" ON "payload"."_pages_v_blocks_call_to_action" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_call_to_action_parent_id_idx" ON "payload"."_pages_v_blocks_call_to_action" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_call_to_action_path_idx" ON "payload"."_pages_v_blocks_call_to_action" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_call_to_action_button_button_page_idx" ON "payload"."_pages_v_blocks_call_to_action" USING btree ("button_page_id");
  CREATE INDEX "_pages_v_blocks_call_to_action_button_button_vertical_idx" ON "payload"."_pages_v_blocks_call_to_action" USING btree ("button_vertical_id");
  CREATE INDEX "_pages_v_blocks_contact_order_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contact_parent_id_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contact_path_idx" ON "payload"."_pages_v_blocks_contact" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "payload"."_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_pages_v_parent_idx" ON "payload"."_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_seo_version_seo_og_image_idx" ON "payload"."_pages_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "payload"."_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "payload"."_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "payload"."_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "payload"."_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "payload"."_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "payload"."_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "payload"."_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "payload"."_pages_v" USING btree ("autosave");
  CREATE INDEX "verticals_who_we_work_with_order_idx" ON "payload"."verticals_who_we_work_with" USING btree ("_order");
  CREATE INDEX "verticals_who_we_work_with_parent_id_idx" ON "payload"."verticals_who_we_work_with" USING btree ("_parent_id");
  CREATE INDEX "verticals_services_order_idx" ON "payload"."verticals_services" USING btree ("_order");
  CREATE INDEX "verticals_services_parent_id_idx" ON "payload"."verticals_services" USING btree ("_parent_id");
  CREATE INDEX "verticals_faqs_order_idx" ON "payload"."verticals_faqs" USING btree ("_order");
  CREATE INDEX "verticals_faqs_parent_id_idx" ON "payload"."verticals_faqs" USING btree ("_parent_id");
  CREATE INDEX "verticals_hero_image_idx" ON "payload"."verticals" USING btree ("hero_image_id");
  CREATE INDEX "verticals_seo_seo_og_image_idx" ON "payload"."verticals" USING btree ("seo_og_image_id");
  CREATE UNIQUE INDEX "verticals_slug_idx" ON "payload"."verticals" USING btree ("slug");
  CREATE INDEX "verticals_updated_at_idx" ON "payload"."verticals" USING btree ("updated_at");
  CREATE INDEX "verticals_created_at_idx" ON "payload"."verticals" USING btree ("created_at");
  CREATE INDEX "verticals__status_idx" ON "payload"."verticals" USING btree ("_status");
  CREATE INDEX "_verticals_v_version_who_we_work_with_order_idx" ON "payload"."_verticals_v_version_who_we_work_with" USING btree ("_order");
  CREATE INDEX "_verticals_v_version_who_we_work_with_parent_id_idx" ON "payload"."_verticals_v_version_who_we_work_with" USING btree ("_parent_id");
  CREATE INDEX "_verticals_v_version_services_order_idx" ON "payload"."_verticals_v_version_services" USING btree ("_order");
  CREATE INDEX "_verticals_v_version_services_parent_id_idx" ON "payload"."_verticals_v_version_services" USING btree ("_parent_id");
  CREATE INDEX "_verticals_v_version_faqs_order_idx" ON "payload"."_verticals_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_verticals_v_version_faqs_parent_id_idx" ON "payload"."_verticals_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_verticals_v_parent_idx" ON "payload"."_verticals_v" USING btree ("parent_id");
  CREATE INDEX "_verticals_v_version_version_hero_image_idx" ON "payload"."_verticals_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_verticals_v_version_seo_version_seo_og_image_idx" ON "payload"."_verticals_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_verticals_v_version_version_slug_idx" ON "payload"."_verticals_v" USING btree ("version_slug");
  CREATE INDEX "_verticals_v_version_version_updated_at_idx" ON "payload"."_verticals_v" USING btree ("version_updated_at");
  CREATE INDEX "_verticals_v_version_version_created_at_idx" ON "payload"."_verticals_v" USING btree ("version_created_at");
  CREATE INDEX "_verticals_v_version_version__status_idx" ON "payload"."_verticals_v" USING btree ("version__status");
  CREATE INDEX "_verticals_v_created_at_idx" ON "payload"."_verticals_v" USING btree ("created_at");
  CREATE INDEX "_verticals_v_updated_at_idx" ON "payload"."_verticals_v" USING btree ("updated_at");
  CREATE INDEX "_verticals_v_latest_idx" ON "payload"."_verticals_v" USING btree ("latest");
  CREATE INDEX "_verticals_v_autosave_idx" ON "payload"."_verticals_v" USING btree ("autosave");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload"."payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload"."payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload"."payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload"."payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload"."payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload"."payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload"."payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload"."payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload"."payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload"."payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload"."payload_jobs" USING btree ("created_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "payload"."site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "payload"."site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_logo_idx" ON "payload"."site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_default_og_image_idx" ON "payload"."site_settings" USING btree ("default_og_image_id");
  CREATE INDEX "navigation_header_links_order_idx" ON "payload"."navigation_header_links" USING btree ("_order");
  CREATE INDEX "navigation_header_links_parent_id_idx" ON "payload"."navigation_header_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_links_link_link_page_idx" ON "payload"."navigation_header_links" USING btree ("link_page_id");
  CREATE INDEX "navigation_header_links_link_link_vertical_idx" ON "payload"."navigation_header_links" USING btree ("link_vertical_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "payload"."navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "payload"."navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_link_link_page_idx" ON "payload"."navigation_footer_links" USING btree ("link_page_id");
  CREATE INDEX "navigation_footer_links_link_link_vertical_idx" ON "payload"."navigation_footer_links" USING btree ("link_vertical_id");
  CREATE INDEX "navigation_header_cta_link_header_cta_link_page_idx" ON "payload"."navigation" USING btree ("header_cta_link_page_id");
  CREATE INDEX "navigation_header_cta_link_header_cta_link_vertical_idx" ON "payload"."navigation" USING btree ("header_cta_link_vertical_id");
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "payload"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload"."payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verticals_fk" FOREIGN KEY ("verticals_id") REFERENCES "payload"."verticals"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "payload"."media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "payload"."media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "payload"."media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "payload"."media" USING btree ("sizes_og_filename");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_verticals_id_idx" ON "payload"."payload_locked_documents_rels" USING btree ("verticals_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "payload"."pages_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_section_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_verticals_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_approach_stages_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_approach_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_why_points_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_why_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_hero" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_section_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_verticals_list" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_approach_stages_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_approach_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_why_points_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_why_points" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_image_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_testimonials" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_call_to_action" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_contact" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."verticals_who_we_work_with" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."verticals_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."verticals_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."verticals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_verticals_v_version_who_we_work_with" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_verticals_v_version_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_verticals_v_version_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."_verticals_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."payload_jobs_log" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."payload_jobs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."site_settings_social_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."site_settings" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."navigation_header_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."navigation_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "payload"."navigation" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "payload"."pages_blocks_hero" CASCADE;
  DROP TABLE "payload"."pages_blocks_section_intro" CASCADE;
  DROP TABLE "payload"."pages_blocks_verticals_list" CASCADE;
  DROP TABLE "payload"."pages_blocks_approach_stages_stages" CASCADE;
  DROP TABLE "payload"."pages_blocks_approach_stages" CASCADE;
  DROP TABLE "payload"."pages_blocks_why_points_points" CASCADE;
  DROP TABLE "payload"."pages_blocks_why_points" CASCADE;
  DROP TABLE "payload"."pages_blocks_image_text" CASCADE;
  DROP TABLE "payload"."pages_blocks_stats_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_stats" CASCADE;
  DROP TABLE "payload"."pages_blocks_testimonials_items" CASCADE;
  DROP TABLE "payload"."pages_blocks_testimonials" CASCADE;
  DROP TABLE "payload"."pages_blocks_call_to_action" CASCADE;
  DROP TABLE "payload"."pages_blocks_contact" CASCADE;
  DROP TABLE "payload"."pages_blocks_rich_text" CASCADE;
  DROP TABLE "payload"."pages" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_hero" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_section_intro" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_verticals_list" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_approach_stages_stages" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_approach_stages" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_why_points_points" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_why_points" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_image_text" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_stats" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_testimonials_items" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_testimonials" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_call_to_action" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_contact" CASCADE;
  DROP TABLE "payload"."_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "payload"."_pages_v" CASCADE;
  DROP TABLE "payload"."verticals_who_we_work_with" CASCADE;
  DROP TABLE "payload"."verticals_services" CASCADE;
  DROP TABLE "payload"."verticals_faqs" CASCADE;
  DROP TABLE "payload"."verticals" CASCADE;
  DROP TABLE "payload"."_verticals_v_version_who_we_work_with" CASCADE;
  DROP TABLE "payload"."_verticals_v_version_services" CASCADE;
  DROP TABLE "payload"."_verticals_v_version_faqs" CASCADE;
  DROP TABLE "payload"."_verticals_v" CASCADE;
  DROP TABLE "payload"."payload_jobs_log" CASCADE;
  DROP TABLE "payload"."payload_jobs" CASCADE;
  DROP TABLE "payload"."site_settings_social_links" CASCADE;
  DROP TABLE "payload"."site_settings" CASCADE;
  DROP TABLE "payload"."navigation_header_links" CASCADE;
  DROP TABLE "payload"."navigation_footer_links" CASCADE;
  DROP TABLE "payload"."navigation" CASCADE;
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_verticals_fk";
  
  DROP INDEX "payload"."media_sizes_thumbnail_sizes_thumbnail_filename_idx";
  DROP INDEX "payload"."media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "payload"."media_sizes_hero_sizes_hero_filename_idx";
  DROP INDEX "payload"."media_sizes_og_sizes_og_filename_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_pages_id_idx";
  DROP INDEX "payload"."payload_locked_documents_rels_verticals_id_idx";
  ALTER TABLE "payload"."media" DROP COLUMN "caption";
  ALTER TABLE "payload"."media" DROP COLUMN "credit";
  ALTER TABLE "payload"."media" DROP COLUMN "source_url";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_url";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_width";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_height";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_mime_type";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_filesize";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_thumbnail_filename";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_url";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_width";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_height";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_mime_type";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_filesize";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_hero_filename";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_url";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_width";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_height";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_mime_type";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_filesize";
  ALTER TABLE "payload"."media" DROP COLUMN "sizes_og_filename";
  ALTER TABLE "payload"."users" DROP COLUMN "name";
  ALTER TABLE "payload"."users" DROP COLUMN "role";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "payload"."payload_locked_documents_rels" DROP COLUMN "verticals_id";
  DROP TYPE "payload"."enum_pages_blocks_section_intro_anchor";
  DROP TYPE "payload"."enum_pages_blocks_verticals_list_anchor";
  DROP TYPE "payload"."enum_pages_blocks_approach_stages_anchor";
  DROP TYPE "payload"."enum_pages_blocks_why_points_points_icon";
  DROP TYPE "payload"."enum_pages_blocks_why_points_anchor";
  DROP TYPE "payload"."enum_pages_blocks_image_text_anchor";
  DROP TYPE "payload"."enum_pages_blocks_image_text_image_side";
  DROP TYPE "payload"."enum_pages_blocks_call_to_action_button_type";
  DROP TYPE "payload"."enum_pages_blocks_call_to_action_button_anchor";
  DROP TYPE "payload"."enum_pages_blocks_contact_anchor";
  DROP TYPE "payload"."enum_pages_status";
  DROP TYPE "payload"."enum__pages_v_blocks_section_intro_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_verticals_list_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_approach_stages_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_why_points_points_icon";
  DROP TYPE "payload"."enum__pages_v_blocks_why_points_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_image_text_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_image_text_image_side";
  DROP TYPE "payload"."enum__pages_v_blocks_call_to_action_button_type";
  DROP TYPE "payload"."enum__pages_v_blocks_call_to_action_button_anchor";
  DROP TYPE "payload"."enum__pages_v_blocks_contact_anchor";
  DROP TYPE "payload"."enum__pages_v_version_status";
  DROP TYPE "payload"."enum_verticals_slug";
  DROP TYPE "payload"."enum_verticals_copy_status";
  DROP TYPE "payload"."enum_verticals_status";
  DROP TYPE "payload"."enum__verticals_v_version_slug";
  DROP TYPE "payload"."enum__verticals_v_version_copy_status";
  DROP TYPE "payload"."enum__verticals_v_version_status";
  DROP TYPE "payload"."enum_users_role";
  DROP TYPE "payload"."enum_payload_jobs_log_task_slug";
  DROP TYPE "payload"."enum_payload_jobs_log_state";
  DROP TYPE "payload"."enum_payload_jobs_task_slug";
  DROP TYPE "payload"."enum_site_settings_social_links_platform";
  DROP TYPE "payload"."enum_navigation_header_links_link_type";
  DROP TYPE "payload"."enum_navigation_header_links_link_anchor";
  DROP TYPE "payload"."enum_navigation_footer_links_link_type";
  DROP TYPE "payload"."enum_navigation_footer_links_link_anchor";
  DROP TYPE "payload"."enum_navigation_header_cta_link_type";
  DROP TYPE "payload"."enum_navigation_header_cta_link_anchor";`)
}
