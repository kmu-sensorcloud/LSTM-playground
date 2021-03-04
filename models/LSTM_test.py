# LSTM Test
import pandas as pd
import numpy as np
import math
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense, LSTM

pd.options.mode.chained_assignment = None

df = pd.read_csv('../data/coin_desk_data.csv', encoding='utf-8-sig')
data = df.filter(['Close']).values

scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(data)

training_data_size = math.ceil(len(scaled_data) * 0.66)
train_data = scaled_data[0: training_data_size]

x_train, y_train = [], []
set_size = 10

for i in range(set_size, len(train_data)):
    x_train.append(train_data[i - set_size: i, 0])
    y_train.append(train_data[i, 0])

x_train, y_train = np.array(x_train), np.array(y_train)
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

model_lstm = Sequential([
    LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)),  # first layer needs input_shape
                                                                         # input layer
                                                                         # 'input_shape=(1,)' == 'input_dim=1'
    LSTM(50, return_sequences=False),
    Dense(units=25),  # hidden layer. units: batch_size
    Dense(units=1)    # output layer
])
model_lstm.compile(optimizer='adam', loss='mean_squared_error')
model_lstm.fit(x_train, y_train, batch_size=1, epochs=1)

test_data = scaled_data[training_data_size - set_size:, :]

x_test = []
y_test = data[training_data_size:, :]

for i in range(set_size, len(test_data)):
    x_test.append(test_data[i - set_size: i, 0])

x_test = np.array(x_test)
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))
predictions = model_lstm.predict(x_test)

# unscaling
predictions = scaler.inverse_transform(predictions)
rmse = np.sqrt(np.mean(predictions - y_test)**2)

predicted_data = df.filter(['Close'])

train = predicted_data[:training_data_size]
valid = predicted_data[training_data_size:]

predictions = pd.DataFrame(predictions)
predictions.columns = ['Predictions']

valid['Predictions'] = predictions['Predictions'].values

plt.plot(valid[['Close', 'Predictions']][:100])
plt.show()