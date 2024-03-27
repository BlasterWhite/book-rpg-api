FROM bigpapoo/r5a05-node
LABEL authors="matgu"

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install pm2 -g

CMD [ "pm2-runtime", "npm", "--", "start" ]

COPY . .

ENV PORT=3000

EXPOSE 3000