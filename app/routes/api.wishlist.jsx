
// import { useEffect, useState } from "react";
// import { Form, useActionData, useLoaderData, useNavigation } from "react-router";

export async function loader() {

  return {
    ok: true,
    message: "this data come from loader"
  }

}

export async function action({request}) {

  const method = request.method;

  return {
    ok: true,
    message: `this data come from action, method is ${method}`
  }

}
