CREATE TYPE "public"."auth_method" AS ENUM('CREDENTIALS', 'GOOGLE', 'YANDEX');--> statement-breakpoint
CREATE TYPE "public"."token_type" AS ENUM('VERIFICATION', 'TWO_FACTOR', 'PASSWORD_RESET');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('REGULAR', 'ADMIN');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"type" "token_type" NOT NULL,
	"expires_in" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"display_name" text NOT NULL,
	"picture" text,
	"role" "user_role" DEFAULT 'REGULAR' NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_two_factor_enabled" boolean DEFAULT false NOT NULL,
	"method" "auth_method" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
