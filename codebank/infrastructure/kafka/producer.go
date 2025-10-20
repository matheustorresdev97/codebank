package kafka

import (
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaProducer struct {
	Producer *ckafka.Producer
}

func NewKafkaProducer() KafkaProducer {
	return KafkaProducer{}
}

func (k *KafkaProducer) SetupProducer() {

    bootstrapServer := "kafka:9092"

    configMap := &ckafka.ConfigMap{
        "bootstrap.servers": bootstrapServer,
    }

    if os.Getenv("security.protocol") != "" {
        (*configMap)["security.protocol"] = os.Getenv("security.protocol")
        (*configMap)["sasl.mechanisms"] = os.Getenv("sasl.mechanisms")
        (*configMap)["sasl.username"] = os.Getenv("sasl.username")
        (*configMap)["sasl.password"] = os.Getenv("sasl.password")
    }

    producer, err := ckafka.NewProducer(configMap)
    if err != nil {
        panic("❌ erro ao criar producer Kafka: " + err.Error())
    }

    k.Producer = producer
}

func (k *KafkaProducer) Publish(msg string, topic string) error {
	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{Topic: &topic, Partition: ckafka.PartitionAny},
		Value:          []byte(msg),
	}
	err := k.Producer.Produce(message, nil)
	if err != nil {
		return err
	}
	return nil
}
