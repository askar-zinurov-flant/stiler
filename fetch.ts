import { randomUUIDv7 } from "bun";
import * as data from "./fetch-data.json";

const response = await fetch(`http://localhost:${process.env.PORT}/reports/simple-list`, {
  method: "POST",
  body: JSON.stringify(data),
  headers: {
    "Content-Type": "application/json",
  },
  verbose: true,
});

await Bun.write(`./tmp/${randomUUIDv7()}.pdf`, response);
