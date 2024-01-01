create database todoapp;

create table todos (id varchar(255) primary key,
 user_email varchar(255),
  title varchar(30),
  description varchar(255),
   progress int,
    date date);

create table users(
    email varchar(255) primary key,
    hashed_password varchar(255)
);
