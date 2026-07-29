FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
CMD curl --fail http://localhost:3000/health || exit 1

CMD ["npm", "start"]