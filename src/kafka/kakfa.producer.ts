// kafka/kafka.producer.ts

import { Injectable } from '@nestjs/common';
import { Kafka, logLevel } from 'kafkajs';

@Injectable()
export class KafkaProducerService {
  private kafka: Kafka;
  private producer;

  constructor() {
    this.kafka = new Kafka({
      clientId: 'hotel-service-producer',
      brokers: [process.env.KAFKA_HOST || 'localhost:9092'],
      logLevel: logLevel.INFO,
    });

    this.producer = this.kafka.producer();
  }

  async sendHotelBookedEvent(hotelTag: string) {
    try {
      await this.producer.connect();
      await this.producer.send({
        topic: 'hotel-events',
        messages: [
          {
            value: JSON.stringify({
              type: 'hotelBooked',
              hotelTag,
            }),
          },
        ],
      });
    } catch (error) {
      console.error('Error occurred while sending Kafka message:', error);
    } finally {
      await this.producer.disconnect();
    }
  }
}
